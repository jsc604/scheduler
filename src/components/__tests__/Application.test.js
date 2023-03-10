import React from "react";
import axios from "axios";
import { render, cleanup, waitForElement, fireEvent, getByText, getAllByTestId, getByAltText, getByPlaceholderText, queryByText, queryByAltText, getAllByAltText } from "@testing-library/react";
import Application from "components/Application";

beforeEach(() => {
  jest.resetModules();
})

afterEach(cleanup);

describe("Application", () => {
  // TEST 1
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Monday")).then(() => {
      fireEvent.click(getByText(container, "Tuesday"));
      expect(getByText(container, "Leopold Silvers")).toBeInTheDocument();
    });
  });

  // TEST 2
  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, 'appointment');
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /Enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, 'Saving...')).toBeInTheDocument();

    await waitForElement(() => queryByText(appointment, "Lydia Miller-Jones"));

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });

  // TEST 3
  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Delete"));

    expect(getByText(appointment, "Are you sure you want to delete this appointment?")).toBeInTheDocument();

    fireEvent.click(getByText(appointment, "Confirm"));

    expect(getByText(appointment, "Deleting...")).toBeInTheDocument();

    await waitForElement(() => getAllByAltText(container, "Add"));

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });

  // TEST 4
  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    const { container} = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Edit"));

    expect(getByAltText(appointment, "Sylvia Palmer")).toBeInTheDocument();

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.change(getByPlaceholderText(appointment, /Enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving...")).toBeInTheDocument();

    await waitForElement(() => queryByText(appointment, "Lydia Miller-Jones"));
                                                                            
    const dayList = getAllByTestId(container, 'day');
    const mondayList = dayList.find((day) => queryByText(day, 'Monday'));
    expect(getByText(mondayList, '1 spot remaining')).toBeInTheDocument();
  });

  // TEST 5
  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, 'appointment');
    const appointment = appointments[0];
    
    fireEvent.click(getByAltText(appointment, "Add"));
    
    fireEvent.change(getByPlaceholderText(appointment, /Enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    
    fireEvent.click(getByText(appointment, "Save"));

    await waitForElement(() => getByText(appointment, 'Error saving appointment!'));
    expect(getByText(appointment, 'Error saving appointment!')).toBeInTheDocument();
  });
  
  // TEST 6
  it("shows the delete error when failing to delete an appointment", async () => {
    axios.delete.mockRejectedValueOnce();
    const { container } = render(<Application />);
    
    await waitForElement(() => getByText(container, "Archie Cohen"));
    
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
      );
      
      fireEvent.click(queryByAltText(appointment, "Delete"));
      
      expect(getByText(appointment, "Are you sure you want to delete this appointment?")).toBeInTheDocument();
      
      fireEvent.click(getByText(appointment, "Confirm"));
      await waitForElement(() => getByText(appointment, 'Error deleting appointment!'));
      expect(getByText(appointment, 'Error deleting appointment!')).toBeInTheDocument();
  });
});
