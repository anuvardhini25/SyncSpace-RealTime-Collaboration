import Room from '../models/Room.js';
import ReplayEvent from '../models/ReplayEvent.js';

const generateRoomCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const createRoom = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Room name is required',
      });
    }

    let roomCode;
    let codeExists = true;
    while (codeExists) {
      roomCode = generateRoomCode();
      codeExists = await Room.findOne({ roomCode });
    }

    const room = await Room.create({
      name,
      roomCode,
      createdBy: req.user._id,
      members: [req.user._id],
    });

    return res.status(201).json({
      success: true,
      message: 'Room created successfully',
      room,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create room',
    });
  }
};

export const joinRoom = async (req, res) => {
  try {
    const { roomCode } = req.body;

    if (!roomCode) {
      return res.status(400).json({
        success: false,
        message: 'Room code is required',
      });
    }

    const room = await Room.findOne({ roomCode: roomCode.toUpperCase() });
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'No room found for this code',
      });
    }

    const alreadyMember = room.members.some(
      (memberId) => memberId.toString() === req.user._id.toString()
    );

    if (!alreadyMember) {
      room.members.push(req.user._id);
      await room.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Joined room successfully',
      room,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to join room',
    });
  }
};

export const getMyRooms = async (req, res) => {
  try {
    const rooms = await Room.find({
      $or: [{ createdBy: req.user._id }, { members: req.user._id }],
    })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch rooms',
    });
  }
};

export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate('createdBy', 'name email');

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    const isMember = room.members.some(
      (memberId) => memberId.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'You are not a member of this room',
      });
    }

    return res.status(200).json({ success: true, room });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch room',
    });
  }
};

// GET /api/rooms/:id/replay
// Returns the full, time-ordered collaboration history for a room so
// the frontend Replay panel can reconstruct the whiteboard/code as they
// evolved. Same membership check as getRoomById - replay history is
// only visible to people who were allowed to be in the room.
const MAX_REPLAY_EVENTS = 3000;

export const getRoomReplay = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).select('members createdBy name');

    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    const isMember = room.members.some(
      (memberId) => memberId.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'You are not a member of this room',
      });
    }

    const events = await ReplayEvent.find({ roomId: room._id })
      .sort({ createdAt: 1 })
      .limit(MAX_REPLAY_EVENTS)
      .lean();

    return res.status(200).json({
      success: true,
      roomName: room.name,
      count: events.length,
      events: events.map((e) => ({
        id: e._id,
        timestamp: new Date(e.createdAt).getTime(),
        type: e.type,
        action: e.action,
        data: e.data,
        userId: e.userId,
        userName: e.userName,
      })),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch replay history',
    });
  }
};