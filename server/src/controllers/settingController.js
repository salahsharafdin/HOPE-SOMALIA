const { prisma } = require('../config');
const { createAuditLog } = require('../utils/auditLogger');

exports.getSettings = async (req, res, next) => {
  try {
    const settingsList = await prisma.setting.findMany();
    const settingsObj = {};
    settingsList.forEach((item) => {
      settingsObj[item.key] = item.value;
    });

    res.json({ success: true, data: settingsObj });
  } catch (error) {
    next(error);
  }
};

exports.updateSettings = async (req, res, next) => {
  try {
    const settingsMap = req.body; // Key-value object { site_name: "...", hero_headline: "..." }

    const updatePromises = Object.keys(settingsMap).map((key) => {
      const val = String(settingsMap[key]);
      return prisma.setting.upsert({
        where: { key },
        update: { value: val },
        create: { id: `set_${key}`, key, value: val },
      });
    });

    await Promise.all(updatePromises);

    await createAuditLog({
      user: req.user,
      action: 'UPDATE_SETTINGS',
      resource: 'Setting',
      details: 'Updated global site & organization settings',
      ipAddress: req.ip,
    });

    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    next(error);
  }
};
