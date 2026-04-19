import React from "react";
import AssetList from "./AssetList";
import AdminAssets from "./admin/AdminAssets";

export default function AssetsPage() {
  const userRole = localStorage.getItem("role") || "USER";

  // If admin, show AdminAssets with full controls
  if (userRole === "ADMIN") {
    return <AdminAssets />;
  }

  // If user, show AssetList with only active resources, no edit/delete
  return <AssetList />;
}