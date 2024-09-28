"use server";
import https from "https";
import axios from "axios";

interface LeetcodeIdAndName {
  id: string;
  name: string;
}

const agent = new https.Agent({
  rejectUnauthorized: false, // Ignore self-signed certificates
});

export async function getLeetcodeUserData(
  leetcodeIdAndName: LeetcodeIdAndName[],
) {
  console.log("Process.env.LEETCODE_API", process.env.LEETCODE_API);

  const leetcodeUserData = await Promise.all(
    leetcodeIdAndName.map(async (user) => {
      const response = await axios.get(
        `${process.env.LEETCODE_API}/userProfile/${user.id}`,
        { httpsAgent: agent }, // Use custom agent in axios
      );
      return {
        ...response.data,
        name: user.name,
      };
    }),
  );

  console.log("leetcodeUserData", leetcodeUserData);
  return leetcodeUserData;
}
