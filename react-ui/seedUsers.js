import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, serviceRoleKey);

async function seedDatabase() {
  try {
    const { data: { users: listedUsers }, error: listUsersError } = await supabase.auth.admin.listUsers()
    if (listUsersError) {
      throw new Error(listUsersError.message);
    }
    if (listedUsers.length > 0) {
      console.log('Reset the database first before seeding new users');
      return;
    }

    // Users
    const seedUsers = [
      { id: 1, email: 'alice.smith@usf.edu', password: 'Usf@AliceSmith123', first_name: 'Alice', last_name: 'Smith', role: 'student' },
      { id: 2, email: 'bob.johnson@usf.edu', password: 'Usf@BobJohnson123', first_name: 'Bob', last_name: 'Johnson', role: 'student' },
      { id: 3, email: 'charlie.brown@usf.edu', password: 'Usf@CharlieBrown123', first_name: 'Charlie', last_name: 'Brown', role: 'student' },
      { id: 4, email: 'david.williams@usf.edu', password: 'Usf@DavidWilliams123', first_name: 'David', last_name: 'Williams', role: 'instructor' },
      { id: 5, email: 'eve.davis@usf.edu', password: 'Usf@EveDavis123', first_name: 'Eve', last_name: 'Davis', role: 'instructor' },
      { id: 6, email: 'frank.miller@usf.edu', password: 'Usf@FrankMiller123', first_name: 'Frank', last_name: 'Miller', role: 'instructor' },
      { id: 7, email: 'grace.wilson@usf.edu', password: 'Usf@GraceWilson123', first_name: 'Grace', last_name: 'Wilson', role: 'advisor' },
      { id: 8, email: 'hank.moore@usf.edu', password: 'Usf@HankMoore123', first_name: 'Hank', last_name: 'Moore', role: 'advisor' },
      { id: 9, email: 'ivy.taylor@usf.edu', password: 'Usf@IvyTaylor123', first_name: 'Ivy', last_name: 'Taylor', role: 'advisor' },
      { id: 10, email: 'jack.anderson@usf.edu', password: 'Usf@JackAnderson123', first_name: 'Jack', last_name: 'Anderson', role: 'staff' },
      { id: 11, email: 'karen.thomas@usf.edu', password: 'Usf@KarenThomas123', first_name: 'Karen', last_name: 'Thomas', role: 'staff' },
      { id: 12, email: 'leo.jackson@usf.edu', password: 'Usf@LeoJackson123', first_name: 'Leo', last_name: 'Jackson', role: 'staff' },
    ];
    console.log('Seeding new users...');
    for (const user of seedUsers) {
      await supabase.auth.admin.createUser({
        email: user.email,
        email_confirm: true,
        password: user.password,
        role: 'authenticated',
        user_metadata: {
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
          id: user.id,
        }
      });
    }
    console.log('Seeded users');

    const { data: { users: usersData }, error: usersError } = await supabase.auth.admin.listUsers();
    if (usersError) {
      throw new Error(usersError.message);
    }
    if (usersData.length !== seedUsers.length) {
      throw new Error('Not all seed users were created');
    }

    function getUserById(id) {
      return usersData.find(user => user.user_metadata.id === id).id;
    }


    // Students
    console.log('Seeding students...');
    const students = [
      { id: getUserById(1), university_number: 'U12345678', major_id: 1 },
      { id: getUserById(2), university_number: 'U23456789', major_id: 2 },
      { id: getUserById(3), university_number: 'U34567890', major_id: 3 },
    ];
    let { error } = await supabase.from('students').insert(students);
    if (error) {
      throw new Error(error.message);
    }
    console.log('Seeded students');

    // Instructors
    const instructors = [
      { id: getUserById(4), department_id: 1 },
      { id: getUserById(5), department_id: 2 },
      { id: getUserById(6), department_id: 3 },
    ];
    await supabase.from('instructors').insert(instructors);
    console.log('Seeded instructors');

    // Advisors
    const advisors = [
      { id: getUserById(7) },
      { id: getUserById(8) },
      { id: getUserById(9) },
    ];
    await supabase.from('advisors').insert(advisors);
    console.log('Seeded advisors');

    const advisorDepartments = [
      { advisor_id: getUserById(7), department_id: 1 },
      { advisor_id: getUserById(8), department_id: 2 },
      { advisor_id: getUserById(9), department_id: 3 },
    ];
    await supabase.from('advisor_department').insert(advisorDepartments);
    console.log('Seeded advisor_department');

    // Staff
    const staff = [
      { id: getUserById(10), department_id: 1 },
      { id: getUserById(11), department_id: 2 },
      { id: getUserById(12), department_id: 3 },
    ];
    await supabase.from('staff').insert(staff);
    console.log('Seeded staff');


    // Course Offerings
    const courseOfferings = [
      { course_id: 1, semester_id: 1, instructor_id: getUserById(4), schedule: { days: "MW", time: "10:00-11:00" }, room_id: 1 },
      { course_id: 2, semester_id: 1, instructor_id: getUserById(4), schedule: { days: "MW", time: "11:00-12:00" }, room_id: 2 },
      { course_id: 3, semester_id: 1, instructor_id: getUserById(4), schedule: { days: "MW", time: "12:00-13:00" }, room_id: 3 },
      { course_id: 4, semester_id: 1, instructor_id: getUserById(5), schedule: { days: "TR", time: "10:00-11:00" }, room_id: 4 },
      { course_id: 5, semester_id: 1, instructor_id: getUserById(5), schedule: { days: "TR", time: "11:00-12:00" }, room_id: 5 },
      { course_id: 6, semester_id: 1, instructor_id: getUserById(5), schedule: { days: "TR", time: "12:00-13:00" }, room_id: 6 },
      { course_id: 7, semester_id: 1, instructor_id: getUserById(6), schedule: { days: "WF", time: "10:00-11:00" }, room_id: 7 },
      { course_id: 8, semester_id: 1, instructor_id: getUserById(6), schedule: { days: "WF", time: "11:00-12:00" }, room_id: 8 },
      { course_id: 9, semester_id: 1, instructor_id: getUserById(6), schedule: { days: "WF", time: "12:00-13:00" }, room_id: 9 },
    ];
    await supabase.from('course_offerings').insert(courseOfferings);
    console.log('Seeded course_offerings');

    // Course Enrollments
    const courseEnrollments = [
      { student_id: getUserById(1), course_offering_id: 1 }, // Alice enrolled in CS 101
      { student_id: getUserById(1), course_offering_id: 2 }, // Alice enrolled in CS 102
      { student_id: getUserById(1), course_offering_id: 3 }, // Alice enrolled in CS 103
      { student_id: getUserById(2), course_offering_id: 4 }, // Bob enrolled in IT 101
      { student_id: getUserById(2), course_offering_id: 5 }, // Bob enrolled in IT 102
      { student_id: getUserById(2), course_offering_id: 6 }, // Bob enrolled in IT 103
      { student_id: getUserById(3), course_offering_id: 7 }, // Charlie enrolled in CY 101
      { student_id: getUserById(3), course_offering_id: 8 }, // Charlie enrolled in CY 102
      { student_id: getUserById(3), course_offering_id: 9 }, // Charlie enrolled in CY 103
    ];
    await supabase.from('course_enrollments').insert(courseEnrollments);
    console.log('Seeded course_enrollments');

    // try to retrieve the tables and log the number of rows in each
    for (const table of ['students', 'instructors', 'advisors', 'staff', 'courses', 'course_offerings', 'course_enrollments']) {
      const { data, error } = await supabase.from(table).select();
      if (error) {
        throw new Error(error.message);
      }
      console.log(`Table: ${table}, Rows: ${data.length}`);
    }

  } catch (error) {
    console.error('Error seeding database:', error.message);
  }
}

seedDatabase();
