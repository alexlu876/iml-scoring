import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

export default function AttendanceEntry({studentId, contestId}: any) {
    const [value, setValue] = React.useState('');

	const handleChange =
	 (event: React.ChangeEvent<HTMLInputElement>) => {
		setValue((event.target as HTMLInputElement).value);
	};

    return (
		<FormControl component="fieldset">
		  <RadioGroup aria-label="position" name="position" value={value} onChange={handleChange} row>
			<FormControlLabel
			  value="noTeam"
			  control={<Radio color="primary" />}
			  label="Attending (No Team)"
			  labelPlacement="end"
			/>
			<FormControlLabel
			  value="notAttending"
			  control={<Radio color="primary" />}
			  label="Not Attending"
			  labelPlacement="end"
			/>
		  </RadioGroup>
		</FormControl>
    )
}
