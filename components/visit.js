import Modal from "./modal.js";

// Class Visit
export class Visit {
  constructor(goal, description, urgency, fullName) {
    this.goal = goal;
    this.description = description;
    this.urgency = urgency;
    this.fullName = fullName;
  }
}

// Class VisitCardiologist
export class VisitCardiologist extends Visit {
  constructor(
    goal,
    description,
    urgency,
    fullName,
    pressure,
    bodymassindex,
    discase,
    age,
    comments
  ) {
    super(goal, description, urgency, fullName);
    this.pressure = pressure;
    this.bodymassindex = bodymassindex;
    this.discase = discase;
    this.age = age;
    this.comments = comments;
  }
}

// Class VisitDentist
export class VisitDentist extends Visit {
  constructor(goal, description, urgency, fullName, lastvisit, comments) {
    super(goal, description, urgency, fullName);
    this.lastvisit = lastvisit;
    this.comments = comments;
  }
}

// Class VisitTherapist
export class VisitTherapist extends Visit {
  constructor(goal, description, urgency, fullName, age, comments) {
    super(goal, description, urgency, fullName);
    this.age = age;
    this.comments = comments;
  }
}
