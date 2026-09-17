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

form.addEventListener("submit", (e) => {
  e.preventDefault();
  [dayInput, monthInput, yearInput].forEach(clearError);
  form.classList.remove("form--error");

  let day = dayInput.value;
  let month = monthInput.value;
  let year = yearInput.value;
  const currentYear = new Date().getFullYear();

  let errorCount = 0;
  if (day !== "") {
    day = Number(day);
    if (day > 31 || day <= 0 || Number.isNaN(day)) {
      showError(dayInput, "Must be a valid day");
      errorCount++;
    } else {
      clearError(dayInput);
    }
  } else {
    showError(dayInput, "This field is required");
    errorCount++;
  }

  if (month !== "") {
    month = Number(month);
    if (month > 12 || month <= 0 || Number.isNaN(month)) {
      showError(monthInput, "Must be a valid month");
      errorCount++;
    } else {
      clearError(monthInput);
    }
  } else {
    showError(monthInput, "This field is required");
    errorCount++;
  }

  if (year !== "") {
    year = Number(year);
    if (year > currentYear || year < 0 || Number.isNaN(year)) {
      showError(yearInput, "Must be in the past");

      errorCount++;
    } else {
      clearError(yearInput);
    }
  } else {
    showError(yearInput, "This field is required");
    errorCount++;
  }

  if (errorCount === 0) {
    if (!isValidDate(day, month, year)) {
      form.classList.add("form--error");
      return;
    } else {
      form.classList.remove("form--error");

      (async () => {
        const age = getAge(new Date(year, month - 1, day));

        await animateNumber(yearValue, age.years, 1200);
        await animateNumber(monthValue, age.months, 800);
        await animateNumber(dayValue, age.days, 800);
      })();
    }
  }
});
