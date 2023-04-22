document.addEventListener("DOMContentLoaded", function () {
  // Get elements from the DOM
  const form = document.getElementById("workout-form");
  const exerciseList = document.getElementById("exercise-list");

  // Load saved exercises from local storage
  loadExercises();

  // Function to handle form submission
  function onSubmit(event) {
    event.preventDefault();

    // Get input values
    const exercise = document.getElementById("exercise").value;
    const reps = document.getElementById("reps").value;
    const sets = document.getElementById("sets").value;
    const setTime = document.getElementById("set-time").value;
    const recoveryTime = document.getElementById("recovery-time").value;

    // Exercise object
    const exerciseObj = {
      exercise,
      reps,
      sets,
      setTime,
      recoveryTime,
      completed: false,
    };

    // Add exercise to local storage
    addExerciseToLocalStorage(exerciseObj);

    // Add exercise to the list
    addExerciseToList(exerciseObj);

    // Clear the input fields
    form.reset();
  }

  // Function to load exercises from local storage
  function loadExercises() {
    const exercises = getExercisesFromLocalStorage();

    exercises.forEach(addExerciseToList);
  }

  // Function to add an exercise to the list
  function addExerciseToList(exerciseObj) {
    // Create a new list item
    const li = document.createElement("li");
    li.setAttribute("data-exercise-obj", JSON.stringify(exerciseObj));
    li.innerHTML = `
        ${exerciseObj.exercise} - ${exerciseObj.reps} reps x ${
      exerciseObj.sets
    } sets (${exerciseObj.setTime}s per set, ${
      exerciseObj.recoveryTime
    }s recovery)
        <button class="completed-btn">${
          exerciseObj.completed ? "Completed" : "Complete"
        }</button>
        <button class="remove-btn">Remove</button>
    `;

    // Add event listener to the "Complete" button
    li.querySelector(".completed-btn").addEventListener("click", function () {
      li.classList.toggle("completed");
      exerciseObj.completed = !exerciseObj.completed;
      this.textContent = exerciseObj.completed ? "Completed" : "Complete";
      updateLocalStorage();
    });

    // Add event listener to the "Remove" button
    li.querySelector(".remove-btn").addEventListener("click", function () {
      li.remove();
      removeExerciseFromLocalStorage(exerciseObj);
    });

    // Add the list item to the exercise list
    exerciseList.appendChild(li);
  }

  // Function to get exercises from local storage
  function getExercisesFromLocalStorage() {
    const exercises = localStorage.getItem("exercises");

    if (exercises) {
      return JSON.parse(exercises);
    } else {
      return [];
    }
  }

  // Function to add an exercise to local storage
  function addExerciseToLocalStorage(exerciseObj) {
    const exercises = getExercisesFromLocalStorage();
    exercises.push(exerciseObj);
    localStorage.setItem("exercises", JSON.stringify(exercises));
  }

  // Function to remove an exercise from local storage
  function removeExerciseFromLocalStorage(exerciseObjToRemove) {
    const exercises = getExercisesFromLocalStorage();
    const updatedExercises = exercises.filter(
      (exerciseObj) => exerciseObj !== exerciseObjToRemove
    );
    localStorage.setItem("exercises", JSON.stringify(updatedExercises));
  }

  // Function to update local storage
  function updateLocalStorage() {
    const exercises = Array.from(
      document.querySelectorAll("#exercise-list li")
    ).map((li) => {
      const exerciseObj = JSON.parse(li.getAttribute("data-exercise-obj"));
      exerciseObj.completed = li.classList.contains("completed");
      return exerciseObj;
    });
    localStorage.setItem("exercises", JSON.stringify(exercises));
  }

  // Add event listener to the form
  form.addEventListener("submit", onSubmit);
});
