import mongoose from "mongoose";

const AnnouncementSchema = new mongoose.Schema(
    {
        shop: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Announcement ||
    mongoose.model("Announcement", AnnouncementSchema);
