const bcrypt = require('bcryptjs');
const { prisma } = require('../config');
const { createAuditLog } = require('../utils/auditLogger');

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        status: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    const mappedUsers = users.map(u => ({
      ...u,
      isActive: u.status === 'ACTIVE'
    }));
    res.json({ success: true, count: mappedUsers.length, data: mappedUsers });
  } catch (error) {
    next(error);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { email, password, fullName, role } = req.body;
    if (!email || !password || !fullName || !role) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        fullName,
        role,
      },
      select: { id: true, email: true, fullName: true, role: true, status: true, createdAt: true },
    });

    await createAuditLog({
      user: req.user,
      action: 'CREATE_ADMIN_USER',
      resource: 'User',
      resourceId: newUser.id,
      details: `Created new admin user '${newUser.fullName}' with role '${newUser.role}'`,
      ipAddress: req.ip,
    });

    res.status(201).json({ success: true, message: 'User created successfully', data: { ...newUser, isActive: newUser.status === 'ACTIVE' } });
  } catch (error) {
    next(error);
  }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role, isActive } = req.body;
    
    let status = undefined;
    if (isActive !== undefined) {
      status = isActive ? 'ACTIVE' : 'DISABLED';
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(role ? { role } : {}),
        ...(status ? { status } : {}),
      },
      select: { id: true, email: true, fullName: true, role: true, status: true },
    });

    await createAuditLog({
      user: req.user,
      action: 'UPDATE_ADMIN_USER',
      resource: 'User',
      resourceId: updatedUser.id,
      details: `Updated role/status for '${updatedUser.fullName}' to Role: ${updatedUser.role}, Status: ${updatedUser.status}`,
      ipAddress: req.ip,
    });

    res.json({ success: true, message: 'User updated successfully', data: { ...updatedUser, isActive: updatedUser.status === 'ACTIVE' } });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account.' });
    }

    const deletedUser = await prisma.user.delete({ where: { id } });

    await createAuditLog({
      user: req.user,
      action: 'DELETE_ADMIN_USER',
      resource: 'User',
      resourceId: id,
      details: `Deleted admin user '${deletedUser.fullName}'`,
      ipAddress: req.ip,
    });

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};
