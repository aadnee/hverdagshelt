import { syncDatabase } from '../src/models';

syncDatabase(function(res) {
  console.log(res);
  process.exit();
});
