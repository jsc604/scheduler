import React from "react";

import "components/InterviewerListItem.scss";
import classNames from "classnames";

export default function InterviewerListItem(props) {
  const interviewersClass = classNames('interviewers__item', {
    'interviewers__item--selected': props.selected
  });

  const interviewerName = props.selected ? props.name : '';

  return (
    <li
      className={interviewersClass}
      onClick={props.setInterviewer}
    >
      <img
        className="interviewers__item-image"
        src={props.avatar}
        alt={interviewerName}
      />
      {interviewerName}
    </li>
  );
};