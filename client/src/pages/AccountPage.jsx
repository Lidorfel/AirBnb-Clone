import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";

export default function AccountPage() {
  const { subpage } = useParams();
  const { ready, user, setUser } = useContext(UserContext);
  const [redirect, setRedirect] = useState(null);

  async function handleLogout() {
    await axios.post("/logout");
    alert("Logout Successfully");
    setRedirect("/");
    setUser(null);
  }
  if (redirect) return <Navigate to={redirect} />;

  if (!ready) {
    return "Loading.....";
  }
  if (ready && !user) {
    return <Navigate to={"/login"} />;
  }
  function linkClasses(type = undefined) {
    let classes = "py-2 px-6";
    if (type == subpage) classes += " bg-primary text-white rounded-full";
    return classes;
  }
  return (
    <div>
      <nav className="w-full flex mt-8 gap-2 justify-center mb-8">
        <Link className={linkClasses()} to={"/account"}>
          My Profile
        </Link>
        <Link className={linkClasses("bookings")} to={"/account/bookings"}>
          My Bookings
        </Link>
        <Link className={linkClasses("places")} to={"/account/places"}>
          My Accomandations
        </Link>
      </nav>
      {subpage === undefined && (
        <div className="text-center max-w-xl mx-auto">
          Logged in as {user.name} ({user.email})
          <br />
          <button onClick={handleLogout} className="primary max-w-sm mt-2">
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
