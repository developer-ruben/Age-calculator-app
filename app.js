const form = document.getElementById("form");

const dayInput = document.getElementById("day");
const monthInput = document.getElementById("month");
const yearInput = document.getElementById("year");

const yearValue = document.getElementById("year-value");
const monthValue = document.getElementById("month-value");
const dayValue = document.getElementById("day-value");

function isValidDate(day, month, year) {
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function isFutureDate(day, month, year) {
  const date = new Date(year, month - 1, day);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return date > today;
}

function getAge(fromDate, toDate = new Date()) {
  let years = toDate.getFullYear() - fromDate.getFullYear();
  let months = toDate.getMonth() - fromDate.getMonth();
  let days = toDate.getDate() - fromDate.getDate();

  if (days < 0) {
    months--;

    const daysInPreviousMonth = new Date(
      toDate.getFullYear(),
      toDate.getMonth(),
      0,
    ).getDate();

    days += daysInPreviousMonth;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
}

function animateNumber(element, target, duration = 1000) {
  return new Promise((resolve) => {
    const start = performance.now();

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function update(timestamp) {
      const progress = Math.min((timestamp - start) / duration, 1);
      const value = Math.floor(easeOutCubic(progress) * target);

      element.textContent = value;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target;
        resolve();
      }
    }

    requestAnimationFrame(update);
  });
}

function showError(input, message) {
  input.nextElementSibling.textContent = message;
  input.closest(".form__group").classList.add("form__group--error");
}

function clearError(input) {
  input.closest(".form__group").classList.remove("form__group--error");
}

function validateInput(input, { min, max, message }) {
  const value = input.value.trim();

  if (value === "") {
    showError(input, "This field is required");
    return null;
  }

  const number = Number(value);

  if (Number.isNaN(number) || number < min || number > max) {
    showError(input, message);
    return null;
  }

  clearError(input);

  return number;
}

function validateDate(day, month, year) {
  // Check if the date actually exists
  if (!isValidDate(day, month, year)) {
    form.classList.add("form--error");
    return false;
  }

  // Check if the date is in the future
  if (isFutureDate(day, month, year)) {
    form.classList.add("form--error");
    return false;
  }

  form.classList.remove("form--error");

  return true;
}

function validateForm() {
  const currentYear = new Date().getFullYear();

  const day = validateInput(dayInput, {
    min: 1,
    max: 31,
    message: "Must be a valid day",
  });

  const month = validateInput(monthInput, {
    min: 1,
    max: 12,
    message: "Must be a valid month",
  });

  const year = validateInput(yearInput, {
    min: 1,
    max: currentYear,
    message: "Must be in the past",
  });

  // Stop if any individual field is invalid
  if (day === null || month === null || year === null) {
    return null;
  }

  // Validate the complete date
  if (!validateDate(day, month, year)) {
    return null;
  }

  return { day, month, year };
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Reset previous errors
  [dayInput, monthInput, yearInput].forEach(clearError);
  form.classList.remove("form--error");

  const values = validateForm();

  if (!values) return;

  const { day, month, year } = values;

  const age = getAge(new Date(year, month - 1, day));

  await animateNumber(yearValue, age.years, 1200);
  await animateNumber(monthValue, age.months, 800);
  await animateNumber(dayValue, age.days, 800);
});
