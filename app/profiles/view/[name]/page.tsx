// /pages/profiles/view/[name]/page.js
"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

const UserProfile = () => {
  const session=useSession();
  const { name } = useParams();
  const [userFound, setUserFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await axios.post('/api/checkname', { name });
        if (res.status == 501) {
          setUserFound(true); // User found
        }
      } catch (error) {
        console.error("Error checking user:", error);
      } finally {
        setLoading(false); // Set loading to false regardless of the outcome
      }
    };

    checkUser();
  }, [name]);

  if (loading) {
    return <div>Loading...</div>;
  }
 if(userFound==false){
  return <div>
    User Not Found
  </div>
 }
  return (
    <div>
      <div>
        Welcome
      </div>
    </div>
  );
};

export default UserProfile;
