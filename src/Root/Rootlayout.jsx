import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <div >
      {/* <Navbar /> */}
      <main>
        <Outlet />
      </main>
      {/* <Footer /> */}
    </div>
  );
}