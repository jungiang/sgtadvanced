


class SGT_template{
	/* constructor - sets up sgt object 
	params: (object) elementConfig - all pre-made dom elements used by the app
	purpose: 
		- Instantiates a model and stores pre-made dom elements it this object
		- Additionally, will generate an object to store created students 
		  who exists in our content management system (CMS)
	return: undefined
	ESTIMATED TIME: 1 hour
	*/
	constructor( elementConfig ){
		this.elementConfig = elementConfig;
		this.serverData = null;
		this.data = {}

		$(this.elementConfig.displayArea).text('User Info Unavailable');

		this.handleCancel = this.handleCancel.bind(this);
		this.handleAdd = this.handleAdd.bind(this);
	}
	/* addEventHandlers - add event handlers to premade dom elements
	adds click handlers to add and cancel buttons using the dom elements passed into constructor
	params: none
	return: undefined
	ESTIMATED TIME: 15 minutes
	*/

	addEventHandlers(){
		this.elementConfig.addButton.on('click', this.handleAdd);
		this.elementConfig.cancelButton.on('click', this.handleCancel);
		$('#dataButton').on('click', this.getDataFromServer);
	}
	/* clearInputs - take the three inputs stored in our constructor and clear their values
	params: none
	return: undefined
	ESTIMATED TIME: 15 minutes
	*/

	getDataFromServer(){
		var serverData = null;
		var ajaxObject = {
			dataType: 'json',
			url: '/api/grades',
			method: 'get',
			data: {
				api_key: '2y1dCaSTzd',
			},
			success: function(result){
				SGT.data = {};
				serverData = result;
				for(var i = 0; i < serverData.data.length; i++){
					var student = serverData.data[i];
					SGT.createStudent(student.name, student.course, student.grade, student.id);
				}
				SGT.displayAllStudents();		
			},
			error: function(){
				alert('Failed to contact server');
			}
		}

		$.ajax(ajaxObject);
	}

	findHint(){
		while(this.getDataFromServer.hasOwnProperty('hint')){

		}
	}

	addDataToServer(newName, newCourse, newGrade){
		var ajaxObject = {
			dataType: 'json',
			url: '/api/grades',
			method: 'POST',
			data: {
				api_key: '2y1dCaSTzd',
				name: newName,
				course: newCourse,
				grade: newGrade
			},
			success: function(result){
				if(result.success){
					SGT.getDataFromServer();
				}else{
					alert(result.errors[0]);
				}
			},
			error: function(){
				alert('Failed to contact server');
			}
		}

		$.ajax(ajaxObject);
	}

	deleteDataFromServer(id){
		var ajaxObject = {
			dataType: 'json',
			url: 'api/grades?student_id='+id,
			method: 'delete',
			success: function(result){
				if(result.success){
					SGT.getDataFromServer();
				}else{
					alert(result.errors[0]);
				}
			},
			error: function(){
				alert('Failed to contact server');
			}
		}

		$.ajax(ajaxObject);
	}

	clearInputs(){
		this.elementConfig.courseInput[0].value = '';
		this.elementConfig.gradeInput[0].value = '';
		this.elementConfig.nameInput[0].value = '';
	}
	/* handleCancel - function to handle the cancel button press
	params: none
	return: undefined
	ESTIMATED TIME: 15 minutes
	*/
	handleCancel(){
		this.clearInputs();
	}
	/* handleAdd - function to handle the add button click
	purpose: grabs values from inputs, utilizes the model's add method to save them, then clears the inputs and displays all students
	params: none
	return: undefined
	ESTIMATED TIME: 1 hour
	*/
	handleAdd(){
		var name = this.elementConfig.nameInput[0].value;
		var course = this.elementConfig.courseInput[0].value;
		var grade = this.elementConfig.gradeInput[0].value;

		this.addDataToServer(name, course, grade);	
		this.clearInputs();
	}
	/* displayAllStudents - iterate through all students in the model
	purpose: 
		grab all students from model, 
		iterate through the retrieved list, 
		then render every student's dom element
		then append every student to the dom's display area
		then display the grade average
	params: none
	return: undefined
	ESTIMATED TIME: 1.5 hours
	*/
	displayAllStudents(){
		var property;
		var displayArea = $(this.elementConfig.displayArea);
		displayArea.empty();
		for(property in this.data){			
			var renderedStudent = this.data[property].render();
			displayArea.append(renderedStudent);
		}
		this.displayAverage();
	}
	/* displayAverage - get the grade average and display it
	purpose: grab the average grade from the model, and show it on the dom
	params: none
	return: undefined 
	ESTIMATED TIME: 15 minutes

	*/

	displayAverage(){
		var property;
		var sum = 0;
		var numStudents = 0;
		for(property in this.data){
			sum = sum + this.data[property].data.grade;
			numStudents++;
		}
		var average = sum / numStudents;
		average = average.toFixed(2);
		var averageArea = $(this.elementConfig.averageArea);
		averageArea.empty();
		averageArea.append(average);
	}
	/* createStudent - take in data for a student, make a new Student object, and add it to this.data object

		name : the student's name
		course : the student's course
		grade: the student's grade
		id: the id of the student
	purpose: 
			If no id is present, it must pick the next available id that can be used
			when it creates the Student object, it must pass the id, name, course, grade, 
			and a reference to SGT's deleteStudent method
	params: 
		name : the student's name
		course : the student's course
		grade: the student's grade
		id: the id of the student
	return: false if unsuccessful in adding student, true if successful
	ESTIMATED TIME: 1.5 hours
	*/
	createStudent(name, course, grade, id){
		if(id === undefined || isNaN(id)){
			var studentObjKeys = Object.keys(this.data);
			if(studentObjKeys.length < 1){
				id = 1;
			}else{
				id = parseInt(studentObjKeys[studentObjKeys.length-1]) + 1;
			}
		}
		if(!this.data.hasOwnProperty(id)){
			this.data[id] = new Student(id, name, course, grade, this.deleteDataFromServer);
			return true;
		}else{
			return false;
		}
	}
	/* doesStudentExist - 
		determines if a student exists by ID.  returns true if yes, false if no
	purpose: 
			check if passed in ID is a value, if it exists in this.data, and return the presence of the student
	params: 
		id: (number) the id of the student to search for
	return: false if id is undefined or that student doesn't exist, true if the student does exist
	ESTIMATED TIME: 15 minutes
	*/
	doesStudentExist(id){
		if(this.data.hasOwnProperty(id)){
			return true;
		}else{
			return false;
		}	
	}
	/* readStudent - 
		get the data for one or all students
	purpose: 
			determines if ID is given or not
			if ID is given, return the student by that ID, if present
			if ID is not given, return all students in an array
	params: 
		id: (number)(optional) the id of the student to search for, if any
	return: 
		a singular Student object if an ID was given, an array of Student objects if no ID was given
		ESTIMATED TIME: 45 minutes
	*/
	readStudent(id){
		if(id === undefined){
			var studentArray = [];
			var property;
			for(property in this.data){
				studentArray.push(this.data[property]);
			}
			return studentArray;
		}else{
			if(this.doesStudentExist(id)){
				return this.data[id];
			}else{
				return false;
			}
		}
	}
	/* updateStudent - 
		not used for now.  Will be used later
		pass in an ID, a field to change, and a value to change the field to
	purpose: 
		finds the necessary student by the given id
		finds the given field in the student (name, course, grade)
		changes the value of the student to the given value
		for example updateStudent(2, 'name','joe') would change the name of student 2 to "joe"
	params: 
		id: (number) the id of the student to change in this.data
		field: (string) the field to change in the student
		value: (multi) the value to change the field to
	return: 
		true if it updated, false if it did not
		ESTIMATED TIME: no needed for first versions: 30 minutes
	*/
	updateStudent(id, field, value){//have to change it to AJAX
		if(this.doesStudentExist(id)){
			this.data[id].data[field] = value;
			this.displayAllStudents();
			return true;
		}else{
			return false;
		}
	}
	/* deleteStudent - 
		delete the given student at the given id
	purpose: 
			determine if the ID exists in this.data
			remove it from the object
			return true if successful, false if not
			this is often called by the student's delete button through the Student handleDelete
	params: 
		id: (number) the id of the student to delete
	return: 
		true if it was successful, false if not
		ESTIMATED TIME: 30 minutes
	*/
	// deleteStudent(studentID){
	// 	this.deleteDataFromServer(studentID);
		// if(this.data.hasOwnProperty(studentID)){
		// 	delete this.data[studentID];
		// 	return true;
		// }else{
		// 	return false;
		// }
	// }
}