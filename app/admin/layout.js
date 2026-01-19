import AdminSidebar from "../_components/admin/admin-sidebar";
import AdminHeader from "../_components/admin/admin-header";

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
