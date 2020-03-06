import React, {useEffect, useState} from "react";
import db from "../utils/firebase";
import "./dAndG.css";

interface iSkill {
  index: number;
  skill: string;
}

let draggedItem: iSkill;

export default function DragAndDrop() {
  const [items, setItems] = useState<iSkill[] | []>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [searchedOptions, setSearchedOptions] = useState<string[]>([]);
  const [isOptionsVisible, setIsOptionsVisible] = useState<boolean>(false);

  // const sortObjByIndex = arr => {
  //   const sortedArr = arr.sort((a, b) => a.index - b.index);

  //   return sortedArr;
  // };

  const onDragStart = (e: any, index: number) => {
    draggedItem = items[index];
    console.log(draggedItem);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.parentNode);
    e.dataTransfer.setDragImage(e.target, 20, 20);
  };

  const onDragOver = (index: number) => {
    const draggedOverItem: iSkill = items[index];

    if (draggedItem === draggedOverItem) {
      return;
    }

    let itemsArr: iSkill[] = items.filter(
        item => item.skill !== draggedItem.skill
    );

    itemsArr.splice(index, 0, draggedItem);

    let arrangedItemsArr: iSkill[] = itemsArr.map((item, i) => {
      return {index: i, skill: item.skill};
    });

    setItems(arrangedItemsArr);
  };

  const onDragEnd = () => {
    // saveSkills();
    saveSkills(items);
  };

  const fetchSkills = () => {
    db.collection("skillTags")
        .doc("nitesh")
        .get()
        .then(doc => {
          if (!doc.exists) {
          } else {
            const data: iSkill[] = (doc.data() as any).tags;
            setItems(data);
          }
        });
  };

  // let fetchedSkills = [
  //   { index: 0, skill: "java" },
  //   { index: 1, skill: "javascript" }
  // ];
  // setItems(fetchedSkills);

  const fetchSkillsFromstackExchange = async (query: string) => {
    let url = `https://api.stackexchange.com/2.2/tags?order=desc&sort=popular&site=stackoverflow&inname=${query}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
          let itemsArr: string[] = (items as iSkill[]).map(
              (e: iSkill) => e.skill
          );
          let skillsArr = data.items.map((s: any) => s.name);
          let intersection = skillsArr.filter(
              (x: string) => !itemsArr.includes(x)
          );
          setSkills(skillsArr);
          setSearchedOptions(intersection);
        })
        .catch(error => console.log(error));
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  useEffect(() => {
    const initialFetchSkillsFromstackExchange = async () => {
      let url = `https://api.stackexchange.com/2.2/tags?order=desc&sort=popular&site=stackoverflow`;
      fetch(url)
          .then(response => response.json())
          .then(data => {
            console.log(items);
            let itemsArr = (items as iSkill[]).map(e => e.skill);
            let skillsArr = data.items.map((s: any) => s.name);
            let intersection = skillsArr.filter(
                (x: string) => !itemsArr.includes(x)
            );
            setSkills(skillsArr);
            setSearchedOptions(intersection);
          })
          .catch(error => console.log(error));
    };
    initialFetchSkillsFromstackExchange();
  }, []);

  const setFocus = () => {
    let itemsArr = (items as iSkill[]).map(e => e.skill);

    let intersection = skills.filter(x => !itemsArr.includes(x));

    setSearchedOptions(intersection);
    setIsOptionsVisible(true);
  };

  const removeFocus = () => {
    setTimeout(() => {
      setIsOptionsVisible(false);
    }, 500);
  };
  const saveSkills = (skillsArr: iSkill[]) => {
    db.collection("skillTags")
        .doc("nitesh")
        .set({tags: skillsArr});
  };

  const handleChange = (e: any) => {
    console.log("changing");
    fetchSkillsFromstackExchange(e.target.value);
  };

  const selectSkill = (e: any) => {
    let newItems: iSkill[] = items;
    newItems.push({
      index: items.length,
      skill: e.target.firstChild.nodeValue
    });
    setItems(items);
    setIsOptionsVisible(false);
    setSearchedOptions([]);
    saveSkills(items);
    (document.getElementsByClassName(
        "skill-input"
    )[0] as HTMLInputElement).value = "";
  };

  const removeSkillHandler = (skill: iSkill) => {
    let incr: number = 0;
    var arrangedItemsArr: iSkill[] = (items as iSkill[]).reduce(
        (filtered: iSkill[], item: iSkill) => {
          if (item !== skill) {
            var someNewValue = {index: incr, skill: item.skill};
            filtered.push(someNewValue);
            incr++;
          }
          return filtered;
        },
        []
    );

    // let filtered = items.filter(value => value !== skill);
    // let arrangedItemsArr: iSkill[] = filtered.map((item, i) => {
    //   return { index: i, skill: item.skill };
    // });

    setItems(arrangedItemsArr);

    saveSkills(arrangedItemsArr);
  };

  // useEffect(() => {
  //   if (items.length > 0) {
  //     saveSkills();
  //   }
  // }, [items, saveSkills]);

  return (
      <div className="techSkills">
        <ul>
          {(items as iSkill[]).map((item, idx) => (
              <li
                  key={item.skill}
                  onDragOver={() => onDragOver(idx)}
                  className="drag"
                  draggable
                  onDragStart={e => onDragStart(e, idx)}
                  onDragEnd={() => onDragEnd()}
              >
                <div>
              <span>
                {idx + 1}. {item.skill}
              </span>
                </div>
                <span className="close" onClick={e => removeSkillHandler(item)}>
              &times;
            </span>
              </li>
          ))}
          <li>
            <input
                list="skills"
                name="skills"
                type="text"
                className="skill-input"
                onFocus={setFocus}
                onBlur={removeFocus}
                onChange={handleChange}
                placeholder="Add Skill"
            />
            {isOptionsVisible && (
                <div className="options">
                  {searchedOptions.map((skill, i) => (
                      <div key={i} onClick={selectSkill}>
                        {skill}
                      </div>
                  ))}
                </div>
            )}
          </li>
        </ul>
      </div>
  );
}
