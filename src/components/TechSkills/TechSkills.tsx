import React, { useEffect, useState } from "react";
import { iSkill } from "./interfaces";
import {
  saveSkills,
  fetchSkillsFromDb,
  searchSkillsFromStackExchange,
  fetchSkillsFromstackExchange
} from "./utility";
import "./dAndG.css";

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
      return { index: i, skill: item.skill };
    });

    setItems(arrangedItemsArr);
  };

  const onDragEnd = () => {
    saveSkills(items);
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchSkillsFromDb();
      setItems(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchSkillsFromstackExchange();
      let itemsArr = (items as iSkill[]).map(e => e.skill);
      let skillsArr = data.map((s: any) => s.name);
      let intersection = skillsArr.filter((x: string) => !itemsArr.includes(x));
      setSkills(skillsArr);
      setSearchedOptions(intersection);
    };
    fetchData();
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

  const handleChange = async (e: any) => {
    console.log("changing");
    const data = await searchSkillsFromStackExchange(e.target.value);

    let itemsArr: string[] = (items as iSkill[]).map((e: iSkill) => e.skill);

    let skillsArr = data.map((s: any) => s.name);

    let intersection = skillsArr.filter((x: string) => !itemsArr.includes(x));
    setSkills(skillsArr);
    setSearchedOptions(intersection);
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
          var someNewValue = { index: incr, skill: item.skill };
          filtered.push(someNewValue);
          incr++;
        }
        return filtered;
      },
      []
    );

    setItems(arrangedItemsArr);

    saveSkills(arrangedItemsArr);
  };

  return (
    <div className="techSkills">
      <ul>
        {skillsItems(
          items,
          onDragOver,
          onDragStart,
          onDragEnd,
          removeSkillHandler
        )}
        {inputFields(
          items,
          setFocus,
          removeFocus,
          handleChange,
          isOptionsVisible,
          searchedOptions,
          selectSkill
        )}
      </ul>
    </div>
  );
}

const skillsItems = (
  items: iSkill[],
  onDragOver: any,
  onDragStart: any,
  onDragEnd: any,
  removeSkillHandler: any
) =>
  (items as iSkill[]).map((item, idx) => (
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
  ));

const inputFields = (
  items: iSkill[],
  setFocus: any,
  removeFocus: any,
  handleChange: any,
  isOptionsVisible: boolean,
  searchedOptions: string[],
  selectSkill: any
) =>
  [...Array(10 - items.length)].map((item, idx) => (
    <li key={idx}>
      <input
        list="skills"
        name="skills"
        type="text"
        autoComplete="off"
        className="skill-input"
        onFocus={setFocus}
        onBlur={removeFocus}
        onChange={handleChange}
        disabled={idx !== 0}
        placeholder="Add Skill"
      />
      {isOptionsVisible && idx === 0 && (
        <div className="options">
          {searchedOptions.map((skill, i) => (
            <div className="optionText" key={i} onClick={selectSkill}>
              {skill}
            </div>
          ))}
        </div>
      )}
    </li>
  ));
