const cron = require('node-cron');
const { Op } = require('sequelize');
const Chat = require('../models/chatModel');
const ArchivedChat = require('../models/archivedChat');

function startArchiveJob() {
    console.log("...........into the corn............")

    // Schedule the cron job to run every night at 1:00 AM
    cron.schedule('0 1 * * *', async () => {
        try {
            console.log("  into shedule....")
            // Identify all messages that are one day old
            const oneDayAgo = new Date();
            oneDayAgo.setDate(oneDayAgo.getDate() - 1);

            const oldMessages = await Chat.findAll({
                where: {
                    createdAt: { [Op.lt]: oneDayAgo }
                }
            });

            // Move old messages to the ArchivedChat table
            for (const message of oldMessages) {
                console.log(message);
                await ArchivedChat.create({
                    message: message.message,
                    createdAt: message.createdAt,
                    updatedAt : message.updatedAt
                });
            }

            // Delete old messages from the Chat table
            await Chat.destroy({
                where: {
                    createdAt: { [Op.lt]: oneDayAgo }
                }
            });

            console.log('Archiving completed successfully.....');

        } catch (error) {
            console.error('Error archiving messages:', error);
        }
    });

}
module.exports = { startArchiveJob }