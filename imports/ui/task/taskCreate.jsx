import React from "react";
import {
 Stack, TextField, PrimaryButton, DatePicker, DayOfWeek,
} from "office-ui-fabric-react";

const DayPickerStrings = {
	months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
	shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
	days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
	shortDays: ["S", "M", "T", "W", "T", "F", "S"],
	goToToday: "Go to today",
	prevMonthAriaLabel: "Go to previous month",
	nextMonthAriaLabel: "Go to next month",
	prevYearAriaLabel: "Go to previous year",
	nextYearAriaLabel: "Go to next year",
	closeButtonAriaLabel: "Close date picker",
	isRequiredErrorMessage: "Field is required.",
	invalidInputErrorMessage: "Invalid date format.",
	isOutOfBoundsErrorMessage: "Date must be after today.",
};

const minDate = new Date(Date.now());

const TaskCreate = ({
	onSubmit,
	onTitleChange,
	onDescriptionChange,
	onAssigneeIdChange,
	onDueDateChange,
	titleValue,
	descriptionValue,
	assigneeIdValue,
	dueDateValue,
}) => (
	<div>
		<form onSubmit={onSubmit}>
			<Stack>
				<TextField
					value={titleValue}
					onChange={onTitleChange}
					placeholder="Task Title"
				/>
				<TextField
					value={descriptionValue}
					onChange={onDescriptionChange}
					placeholder="Task Description"
				/>
				<TextField
					value={assigneeIdValue}
					onChange={onAssigneeIdChange}
					placeholder="This is a temp assigneeId entry"
				/>
				<DatePicker
					isRequired={false}
					minDate={minDate}
					strings={DayPickerStrings}
					firstDayOfWeek={DayOfWeek.Sunday}
					placeholder="Please pick a due date"
					ariaLabel="Please pick a due date"
					allowTextInput={false}
					onSelectDate={onDueDateChange}
					value={dueDateValue}
				/>
				<PrimaryButton type="submit">Create</PrimaryButton>
			</Stack>
		</form>
	</div>
);

export default TaskCreate;
