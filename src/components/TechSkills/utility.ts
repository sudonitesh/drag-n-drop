import db from "../../utils/firebase";
import { iSkill } from "./interfaces";

export const saveSkills = (skillsArr: iSkill[]) => {
  db.collection("skillTags")
    .doc("nitesh")
    .set({ tags: skillsArr });
};

export const fetchSkillsFromDb = () => {
  return db
    .collection("skillTags")
    .doc("nitesh")
    .get()
    .then(doc => {
      if (!doc.exists) {
        return [];
      } else {
        const data: iSkill[] = (doc.data() as any).tags;
        return data;
      }
    });
};

export const searchSkillsFromStackExchange = async (query: string) => {
  let url = `https://api.stackexchange.com/2.2/tags?order=desc&sort=popular&site=stackoverflow&inname=${query}`;
  return fetch(url)
    .then(response => response.json())
    .then(data => data.items)
    .catch(error => console.log(error));
};

export const fetchSkillsFromstackExchange = async () => {
  let url = `https://api.stackexchange.com/2.2/tags?order=desc&sort=popular&site=stackoverflow`;
  return fetch(url)
    .then(response => response.json())
    .then(data => data.items)
    .catch(error => console.log(error));
};
