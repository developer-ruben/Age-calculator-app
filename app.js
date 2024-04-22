const form = document.getElementById("form");
const day = document.getElementById("day");
const month = document.getElementById("month");
const year = document.getElementById("year");

const days = document.getElementById("days");
const months = document.getElementById("months");
const years = document.getElementById("years");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  day.parentElement.classList.remove("form__group--error");
  month.parentElement.classList.remove("form__group--error");
  year.parentElement.classList.remove("form__group--error");
  year.nextElementSibling.textContent = "";
  month.nextElementSibling.textContent = "";
  day.nextElementSibling.textContent = "";

  let error = false;

  if (day.value === "" || day.value < 0 || day.value > 31) {
    day.parentElement.classList.add("form__group--error");
    day.nextElementSibling.textContent = "Must be a valid day";
    error = true;
  }

  if (month.value === "" || month.value < 1 || month.value > 12) {
    month.parentElement.classList.add("form__group--error");
    month.nextElementSibling.textContent = "Must be a valid month";
    error = true;
  }

  if (year.value === "" || year > new Date().getFullYear()) {
    year.parentElement.classList.add("form__group--error");
    year.nextElementSibling.textContent = "Must be a valid year";
    error = true;
  }

  if (error) {
    years.textContent = "--";
    months.textContent = "--";
    days.textContent = "--";
    return;
  }

  const date = new Date(year.value, month.value - 1, day.value);
  var now = new Date();
  if (date > now) {
    day.nextElementSibling.textContent = "Date is in the future";

    day.parentElement.classList.add("form__group--error");
    month.parentElement.classList.add("form__group--error");
    year.parentElement.classList.add("form__group--error");
    error = true;
  }

  const daysInMonth = (year, month) => new Date(year, month, 0).getDate();
  const daysInMonthValue = daysInMonth(year.value, month.value); // 31
  if (day.value > daysInMonthValue) {
    day.nextElementSibling.textContent = "Date invalid";

    day.parentElement.classList.add("form__group--error");
    month.parentElement.classList.add("form__group--error");
    year.parentElement.classList.add("form__group--error");
    error = true;
  }

  if (error) {
    years.textContent = "--";
    months.textContent = "--";
    days.textContent = "--";
    return;
  }

  const diff = dateDiff(`${year.value}-${month.value}-${day.value}`);

  countTo(years, diff.years);
  countTo(months, diff.months);
  countTo(days, diff.days);
});

function countTo(el, to) {
  let from = 0;
  let interval = 50;

  if (from == to) {
    el.textContent = String(from);
    return;
  }

  let counter = setInterval(() => {
    from += 1;
    el.textContent = from;

    if (from === to) {
      clearInterval(counter);
    }
  }, interval);
}

function dateDiff(date) {
  date = date.split("-");
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const yy = parseInt(date[0]);
  const mm = parseInt(date[1]);
  const dd = parseInt(date[2]);
  let years, months, days;

  months = month - mm;
  if (day < dd) {
    months = months - 1;
  }

  years = year - yy;
  if (month * 100 + day < mm * 100 + dd) {
    years = years - 1;
    months = months + 12;
  }

  days = Math.floor(
    (today.getTime() - new Date(yy + years, mm + months - 1, dd).getTime()) /
      (24 * 60 * 60 * 1000)
  );

  return { years: years, months: months, days: days };
}
