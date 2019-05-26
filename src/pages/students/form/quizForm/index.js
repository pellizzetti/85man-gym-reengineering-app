import React from 'react';
import { Box, FormField } from 'grommet';

// <Grid
//   fill="horizontal"
//   columns={{
//     count: 2,
//     size: 'auto',
//   }}
//   gap="none"
// >
//   <TextField label="Name" name="name" />
//   <TextField label="Class" name="klass" />
//   <TextField label="Exp" name="exp" />
//   <TextField label="Level" name="level" />
//   <TextField label="Health" name="health" />
//   <TextField label="Max Health" name="maxHealth" />
// </Grid>;

const QuizForm = () => (
  <Box>
    <FormField name="quiz" label="Quiz" />
  </Box>
);

export default QuizForm;
