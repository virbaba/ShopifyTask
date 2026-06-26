import { useState, useEffect } from "react";
import { useFetcher, useLoaderData } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import { connectDB } from "../lib/mongodb.server";
import Announcement from "../models/Announcement.server";
import { saveAnnouncementMetafield } from "../services/shopify-metafield.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);

  await connectDB();

  // Load the most recent announcement for this store from the database
  const latest = await Announcement.findOne({ shop: session.shop })
    .sort({ createdAt: -1 });

  return {
    currentAnnouncement: latest ? latest.text : "",
  };
};

export const action = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const formData = await request.formData();
  const text = formData.get("announcement");

  if (typeof text !== "string") {
    return { success: false, error: "Invalid text input" };
  }

  // 1. Save to MongoDB
  await connectDB();
  const savedAnnouncement = await Announcement.create({
    shop: session.shop,
    text,
  });
  console.log("Saved Announcement to Database:", savedAnnouncement);

  // 2. Sync to Shopify Metafields
  try {
    const metafieldResult = await saveAnnouncementMetafield(admin, text);
    console.log("Metafield Sync Result:", metafieldResult);
  } catch (error) {
    console.error("Metafield Sync Error:", error);
    return { success: false, error: "Failed to sync metafield to Shopify" };
  }

  return {
    success: true,
  };
};

export default function Index() {
  const { currentAnnouncement } = useLoaderData();
  const fetcher = useFetcher();
  const [announcement, setAnnouncement] = useState(currentAnnouncement);
  const [showToast, setShowToast] = useState(false);

  const isSaving = fetcher.state === "submitting";
  const isSaved = fetcher.data?.success;

  useEffect(() => {
    if (isSaved) {
      setShowToast(true);
      setAnnouncement(""); // Clear the input field after successful save
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isSaved]);

  const handleSave = () => {
    fetcher.submit(
      { announcement },
      { method: "POST" }
    );
  };

  return (
    <s-page heading="Announcement Banner Admin">
      <s-section>
        <div style={{
          background: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.03)",
          border: "1px solid #e1e3e5",
          padding: "24px",
          maxWidth: "600px",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
        }}>
          <h2 style={{ fontSize: "16px", fontWeight: "600", color: "#1a1c1d", marginBottom: "16px", marginTop: 0 }}>
            Configure Announcement Text
          </h2>
          <p style={{ fontSize: "13px", color: "#6d7175", marginBottom: "20px", lineHeight: "1.5" }}>
            The announcement text configured here will float at the top of your storefront. Make it compelling for your customers!
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
            <label htmlFor="announcement" style={{ fontSize: "12px", fontWeight: "500", color: "#303030" }}>
              Announcement Text
            </label>
            <input
              id="announcement"
              type="text"
              placeholder="Enter announcement text..."
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                fontSize: "14px",
                lineHeight: "20px",
                color: "#303030",
                background: "#ffffff",
                border: "1px solid #8c9196",
                borderRadius: "8px",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s ease, box-shadow 0.2s ease",
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
            <s-button 
              onClick={handleSave} 
              disabled={isSaving}
              style={{
                cursor: isSaving ? "not-allowed" : "pointer"
              }}
            >
              {isSaving ? "Saving..." : "Save Announcement"}
            </s-button>
          </div>
        </div>
      </s-section>

      {showToast && (
        <div style={{
          position: "fixed",
          bottom: "24px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "#303030",
          color: "#ffffff",
          padding: "12px 24px",
          borderRadius: "8px",
          fontSize: "14px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          zIndex: 10000,
        }}>
          Announcement saved successfully!
        </div>
      )}
    </s-page>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};