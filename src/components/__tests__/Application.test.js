import React from "react";

import {
  render,
  cleanup,
  waitForElement,
  getByText,
  prettyDOM,
  getAllByTestId,
  getByPlaceholderText,
  getByAltText,
  queryByText,
  queryByAltText,
} from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {
  it("renders without crashing", () => {
    render(<Application />);
  });

  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);

    return waitForElement(() => getByText("Monday"));
  });

  it("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {
    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" },
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    expect(getByText(day, "no spot remaining")).toBeInTheDocument();
  });
});

it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
  const { container } = render(<Application />);

  await waitForElement(() => getByText(container, "Archie Cohen"));

  const appointment = getAllByTestId(container, "appointment").find(
    (appointment) => queryByText(appointment, "Archie Cohen")
  );

  fireEvent.click(queryByAltText(appointment, "Delete"));

  expect(
    getByText(appointment, "Would you like to delete the appointment?")
  ).toBeInTheDocument();
  fireEvent.click(getByText(appointment, "Confirm"));

  expect(getByText(appointment, "Appointment deleting")).toBeInTheDocument();

  await waitForElement(() => getByAltText(appointment, "Add"));

  const day = getAllByTestId(container, "day").find((day) =>
    queryByText(day, "Monday")
  );
  expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
});

it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
  const { container } = render(<Application />);

  await waitForElement(() => getByText(container, "Archie Cohen"));

  const appointment = getAllByTestId(container, "appointment").find(
    (appointment) => queryByText(appointment, "Archie Cohen")
  );

  fireEvent.click(getByAltText(appointment, "Edit"));

  fireEvent.change(getByTestId(appointment, "student-name-input"), {
    target: {
      value: "Lydia Miller-Jones",
    },
  });
  fireEvent.click(getByText(appointment, "Save"));

  expect(getByText(appointment, "Appointment saving")).toBeInTheDocument();

  await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

  expect(queryByText(appointment, "Archie Cohen")).not.toBeInTheDocument();

  const day = getByTestId(container, "Monday");

  expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
});

it("shows the save error when failing to save an appointment", async () => {
  axios.put.mockRejectedValueOnce();

  const { container } = render(<Application />);
  await waitForElement(() => getByText(container, "Archie Cohen"));
  const appointment = getAllByTestId(container, "appointment")[0];

  fireEvent.click(getByAltText(appointment, "Add"));
  fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
    target: {
      value: "Lydia Miller-Jones",
    },
  });
  fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
  fireEvent.click(getByText(appointment, "Save"));

  await waitForElement(() => getByText(appointment, "Appointment saving"));

  expect(getByText(appointment, "Error")).toBeInTheDocument();
});

it("shows the delete error when failing to delete an existing appointment", async () => {
  axios.delete.mockRejectedValueOnce();

  const { container } = render(<Application />);
  await waitForElement(() => getByText(container, "Archie Cohen"));
  const appointment = getAllByTestId(container, "appointment").find(
    (appointment) => queryByText(appointment, "Archie Cohen")
  );

  fireEvent.click(getByAltText(appointment, "Delete"));
  expect(
    getByText(appointment, "Are you sure you would like to delete?")
  ).toBeInTheDocument();

  fireEvent.click(getByText(appointment, "Confirm"));

  expect(getByText(appointment, "Deleting")).toBeInTheDocument();
  await waitForElement(() => getByText(appointment, "Error deleting."));

  fireEvent.click(getByAltText(appointment, "Close"));
});
