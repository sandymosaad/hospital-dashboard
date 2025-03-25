if (window.location.href.includes("dashboard")) {
    $(document).ready(function () {
         // hospital data
        let departmentsLength = JSON.parse(localStorage.getItem('Departments')).length;
        let doctorsLength= JSON.parse(localStorage.getItem('Doctors')).length;
        let appointmentsLength= JSON.parse(localStorage.getItem('Appointments')).length;
        let patientsLength = JSON.parse(localStorage.getItem('Patients')).length;

        $("#totalPatients").text(patientsLength);
        $("#totalDoctors").text(doctorsLength);
        $("#totalAppointments").text(appointmentsLength);
        $("#totalDepartments").text(departmentsLength);
        let data = {"patients": patientsLength, "doctors": doctorsLength, "appointments": appointmentsLength, "departments": departmentsLength}
        if (data){
            $(".animatingNumberCounters").each(function () {
                let $this = $(this);
                let targetValue = parseInt($this.text()) || 0;
                $({ Counter: 0 }).animate({
                    Counter: targetValue},
                    {
                    duration: 1000,
                    easing: 'swing',
                    step: function() {
                        $this.text(Math.ceil(this.Counter));
                    }
                    });   
            })
        }

        let patients = JSON.parse(localStorage.getItem('Patients')) || []; 
        let appointments = JSON.parse(localStorage.getItem('Appointments')) || [];
        let doctors = JSON.parse(localStorage.getItem('Doctors')) || [];

        //console.log("Patients Data:", patients);
    
        let specializations = [];
        let labels = new Set();
        let patientCounts = {};
        let maleCount=0;
        let femaleCount=0;
        let countAgeAvraige={ 'under 15':0, 'from 16 to 30':0, 'from 31 to 50':0, 'abave 50':0};
        let ageLabels= ['under 15', 'from 16 to 30', 'from 31 to 50', 'abave 50']
        let statusCount = { 'Recovered': 0, 'Stable': 0, 'Under Treatment': 0, 'Chronic': 0 };
        let statusLabel = ['Recovered', 'Stable', 'Under Treatment', 'Chronic'];

        patients.forEach(patient => {
                        // departments
            let spec = patient.specializationPatient;
            if (!labels.has(spec)) {
                labels.add(spec);
            }
            specializations.push(spec);
            patientCounts[spec] = (patientCounts[spec] || 0) + 1;

            // patient gender
            if(patient.gender==='Male'){
                maleCount+=1
            }else if (patient.gender==='Female'){
                femaleCount+=1
            }

            // patient age
            if (patient.age <= 15){
                countAgeAvraige['under 15']= (countAgeAvraige['under 15'] || 0) + 1;
            }else if (patient.age > 15 && patient.age <= 30){
                countAgeAvraige['from 16 to 30']= (countAgeAvraige['from 16 to 30'] || 0)+1;
            }else if (patient.age > 30 && patient.age <= 50){
                countAgeAvraige['from 31 to 50']= (countAgeAvraige['from 31 to 50'] || 0)+1;
            }else if (patient.age > 50 ){
                countAgeAvraige['abave 50']= (countAgeAvraige['abave 50'] || 0)+1;
            }

            // patient status
            let sta = patient.status;
            statusCount[sta] = (statusCount[sta] || 0) + 1;
        });
        let labelsArray = [...labels]; 
        let countsArray = labelsArray.map(spec => patientCounts[spec]); 
        let ageCountArray = ageLabels.map(label => countAgeAvraige[label] || 0);
        let statusCountArray = statusLabel.map(stat => statusCount[stat] || 0);

        // Appointment Charts
        let labelsStatusAppointments= new Set();
        let statusAppointment ={};

        let doctorHaveAppointments = new Set();
        let doctorHaveAppointmentsObj ={};

        let specializationHasAppointments =new Set();
        let specializationHasAppointmentsObj ={};

        let dateAppointmentObj={};
        let allDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        appointments.forEach(appointment=>{
        let sta= appointment.status;
        let doc = appointment.doctorName;
        let spec = appointment.specialization;

        let date = new Date(appointment.date);
        let todayDate = new Date();
        let sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(todayDate.getDate() - 7);
        
            doctorHaveAppointments.add(doc);
            labelsStatusAppointments.add(sta);
            specializationHasAppointments.add(spec);
            if (date.getTime() >= sevenDaysAgo.getTime() && date.getTime() <= todayDate.getTime()) {
                let dayName=(date.toLocaleString('en-US',{weekday:'short'}))       
                dateAppointmentObj[dayName]=(dateAppointmentObj[dayName]||0) +1
            }

            statusAppointment[sta]= (statusAppointment[sta] || 0) + 1;
            doctorHaveAppointmentsObj[doc] =(doctorHaveAppointmentsObj[doc] || 0) + 1;
            specializationHasAppointmentsObj[spec]= (specializationHasAppointmentsObj[spec] || 0) +1;
        })
        console.log(dateAppointmentObj)

        let labelsStatusAppointmentsArray = [...labelsStatusAppointments];
        let statusAppointmentCount = labelsStatusAppointmentsArray.map(sta => statusAppointment[sta] || 0);

        let doctorHaveAppointmentsArray = [...doctorHaveAppointments];
        let doctorHaveAppointmentsCount = doctorHaveAppointmentsArray.map(doc => doctorHaveAppointmentsObj[doc]|| 0);

        let specializationHasAppointmentsArray =[...specializationHasAppointments];
        let specializationHasAppointmentsCount = specializationHasAppointmentsArray.map(spec => specializationHasAppointmentsObj[spec]|| 0);
        
        let dateAppointmentLabels =allDays;
        let dateAppointmentCount =dateAppointmentLabels.map(day => dateAppointmentObj[day] || 0);

       
        //  console.log(dateAppointmentLabels)
        // console.log(dateAppointmentCount)

        let allSpecializationsLabels = JSON.parse(localStorage.getItem('Departments'));
        let doctorsoOfSpecializationObj ={};
        doctors.forEach(
            doctor=>{
                let spec = doctor.specialization;
                doctorsoOfSpecializationObj[spec]= (doctorsoOfSpecializationObj[spec] || 0) +1
            }
        )
        console.log(doctorsoOfSpecializationObj)
        let doctorsoOfSpecializationCount =allSpecializationsLabels.map(spec =>doctorsoOfSpecializationObj[spec] || 0 )



        function generateRandomColor() {
            return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        }
    
        let backgroundColors = labelsArray.map(() => generateRandomColor());
        let ctx1 = document.getElementById("patientsChart").getContext("2d");
        new Chart(ctx1, {
            type: "bar",
            data: {
                labels: labelsArray,
                datasets: [{
                    label: "Count Patients in each department",
                    data: countsArray, 
                    backgroundColor: backgroundColors, 
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
            }
        });

        // gender chart
        let genders = ["Male", "Female"];
        let genderCounts = [maleCount, femaleCount];  

        let ctx2 = document.getElementById("genderChart").getContext("2d");
        new Chart(ctx2, {
            type: "pie",
            data: {
                labels: genders,
                datasets: [{
                    label: "Ratio of males and females",
                    data: genderCounts,
                    backgroundColor: ["#3498db", "#e74c3c"],
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
            }
        });
        // age chart
        let ctx3 = document.getElementById('ageChart').getContext('2d');
        new Chart (ctx3,{
            type:'line',
            data:{
                labels:ageLabels,
                datasets:[{
                    label: 'Ratio of age of patients',
                    data:ageCountArray,
                    backgroundColor: ["#3498db"]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
            }
            
        })

        // status patients chart
        let ctx4 = document.getElementById('statusChart').getContext('2d');
        new Chart (ctx4,{
            type:'line',
            data:{
                labels:statusLabel,
                datasets:[{
                    label:'Ratio of Status of Patients',
                    data:statusCountArray,
                    backgroundColor: ["#3498db"]

                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
            }
        })

        // status appointment chart
        backgroundColors = labelsStatusAppointmentsArray.map(() => generateRandomColor());
        let ctx5 = document.getElementById('appointmentStatusChart').getContext('2d');
        new Chart (ctx5,{
                type:'bar',
                data:{
                    labels:labelsStatusAppointmentsArray,
                    datasets:[{
                        label:'Ratio of Status of Appointments',
                        data: statusAppointmentCount,
                        backgroundColor:backgroundColors
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                }
            })

        // appointmentDoctorsChart
        backgroundColors = doctorHaveAppointmentsArray.map(() => generateRandomColor());
        let ctx6 = document.getElementById('appointmentDoctorsChart').getContext('2d');
        new Chart (ctx6, {
            type:'bar',
            data:{
                labels:doctorHaveAppointmentsArray,
                datasets:[{
                    label:'Number of appointments for each doctor',
                    data:doctorHaveAppointmentsCount,
                    backgroundColor:backgroundColors
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
            }
        })

        //appointmentSpecializationChart
        backgroundColors = specializationHasAppointmentsArray.map(() => generateRandomColor());
        let ctx7= document.getElementById('appointmentSpecializationChart').getContext('2d');
        new Chart(ctx7, {
            type:'line',
            data:{
                labels:specializationHasAppointmentsArray,
                datasets:[{
                    label:'Number of appointments for each specialization',
                    data:specializationHasAppointmentsCount,
                    backgroundColor:backgroundColors
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
            }
        })
        
        backgroundColors = dateAppointmentLabels.map(() => generateRandomColor());
        let ctx8 = document.getElementById('appointmentDateChart');
        new Chart(ctx8, {
            type:'line',
            data:{
                labels:dateAppointmentLabels,
                datasets:[{
                    label:'Number of appointment in each day in last week',
                    data:dateAppointmentCount,
                    backgroundColor:backgroundColors,
                    dateAppointmentCount
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
            }
        })

        // doctor charts
        backgroundColors = allSpecializationsLabels.map(() => generateRandomColor());
        let ctx9 = document.getElementById('doctorsAtSpecializationChart');
        new Chart(ctx9, {
            type:'line',
            data:{
                labels:allSpecializationsLabels,
                datasets:[{
                    label:'Number of doctors in each specialization ',
                    data:doctorsoOfSpecializationCount,
                    backgroundColor:backgroundColors,
                    dateAppointmentCount
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
            }
        })

    });
}

// -in add doctor want to make spacializtion dropdown 
// - in add appoitment make the spacilaiztion depand in doctor name 


$(document).ready(function () {
    let hospitalDepartments=["Emergency", 'Cardiology', 'Dental', 'Physical Therapy',' General Surgery','Hematology'];
    localStorage.setItem('Departments',JSON.stringify(hospitalDepartments));

    // display data
    let patientsTable = $('#patientsTable').DataTable({
        "scrollX": false, 
        "responsive": true,
        "autoWidth": false,
        "columnDefs": [
            { "width": "10px", "targets": 0 },
            { "width": "25px", "targets": 1 },
            { "width": "35px", "targets": 2 },
            { "width": "35px", "targets": 3 },
            { "width": "50px", "targets": 4 },
            { "width": "40px", "targets": 5 },
            { "width": "40px", "targets": 6 },
            { "width": "40px", "targets": 7},
            { "width": "50px", "targets": 8 },
        ]
    });
    let doctorsTable = $('#doctorsTable').DataTable({
        "scrollX": false, 
        "responsive": true,
        "autoWidth": false,
        "columnDefs": [
            { "width": "10px", "targets": 0 },
            { "width": "50px", "targets": 1 },
            { "width": "50px", "targets": 2 },
            { "width": "60px", "targets": 3 },
            { "width": "60px", "targets": 4 },
            { "width": "45px", "targets": 5 },
            { "width": "45px", "targets": 6 },
        ]
    });
    let appointmentsTable = $('#appointmentsTable').DataTable({
        "scrollX": false, 
        "responsive": true,
        "autoWidth": false,
        "columnDefs": [
            { "width": "10px", "targets": 0 },
            { "width": "50px", "targets": 1 },
            { "width": "50px", "targets": 2 },
            { "width": "60px", "targets": 3 },
            { "width": "60px", "targets": 4 },
            { "width": "30px", "targets": 5 },
            { "width": "60px", "targets": 6 },
            { "width": "60px", "targets": 7}
        ]
    });
    
    

    function displayData(table, storageKey, columns) {
        let data = JSON.parse(localStorage.getItem(storageKey));
        table.clear();
        if(data && data.length > 0) {
            data.forEach(item => {
                let rowData = columns.map(column=>item[column] || "No Data")
                rowData.push(`
                    <div>   
                        <button class="btn btn-outline-danger deleteItem" data-id="${item.id}" data-type="${storageKey}"  data-columns='${JSON.stringify(columns)}'>Delete</button>                            
                        <button class="btn btn-outline-warning editItem" data-id="${item.id}" data-type="${storageKey}"  data-columns='${JSON.stringify(columns)}'>Edit</button>
                    </div>
                `);
                table.row.add(rowData);
            })
        } else {
            table.row.add(Array(columns.length + 1).fill("No Data")); 
        }
        table.draw();
    }
    displayData(patientsTable, 'Patients', ['id', 'name', 'age', 'gender',  'phone', 'status', 'disease','specializationPatient']);

    displayData(doctorsTable, 'Doctors', ['id', 'name', 'specialization', 'email', 'phone', 'status']);
    displayData(appointmentsTable, 'Appointments', ['id', 'doctorName', 'patientName', 'specialization', 'date', 'time', 'status']);


    //rest form
    function resetForm(formId, saveBtnId, updateBtnId, dropdowns = {}) {
        $(formId)[0].reset();
        $(saveBtnId).show();  
        $(updateBtnId).addClass('d-none').hide(); 
    
        Object.keys(dropdowns).forEach(selector => {
            $(selector).text(dropdowns[selector]);
        });
    }
    $('.addPatientBtn').on('click', function () {
        resetForm('#patientsForm','#savePatientBtn','#updatePatientBtn' )
        $('#saveItemBtn').show();
        $('#updateItemBtn').addClass('d-none').hide();
        showItemsInDropDownListSpecialization();
    })
    $('#addDoctorBtn').on('click', function(){
        resetForm('#doctorsForm', '#saveDoctorBtn', '#updateDoctorBtn');
        $('#saveItemBtn').show();
        $('#updateItemBtn').addClass('d-none').hide();
    });
    $('#addAppointmentBtn').on('click', function(){      
        resetForm('#appointmentsForm', '#saveAppointmentBtn', '#updateAppointmentBtn', {
            '.dropdown-toggle-doctor': 'Doctors',
            '.dropdown-toggle-specialization': 'Specializations'
        });
        $('#saveItemBtn').show();
        $('#updateItemBtn').addClass('d-none').hide();
    
        showItemsInDropDownListDoctorsAndSpecialization(); 
    });
    function showItemsInDropDownListDoctorsAndSpecialization(){
        let doctors=JSON.parse(localStorage.getItem('Doctors')) || [];
        $('.doctorNameAppointment ul').empty();
        doctors.forEach(
            doctor => {
                let doctorName= `<li><a class="dropdown-item" href="#" id='doctorNameAppointment' name='doctorNameAppointment' value='${doctor.name}'>${doctor.name}</a></li>`;
                $('.doctorNameAppointment ul').append(doctorName);
            }
        )
        let departments = JSON.parse(localStorage.getItem("Departments"))|| []
        $('.specializationAppointment ul').empty();
        departments.forEach(
            department => {
                let departmentName = `<li><a class="dropdown-item" href="#">${department}</a></li>`;
                $('.specializationAppointment ul').append(departmentName);
            }
        )
    }
    function showItemsInDropDownListSpecialization(){
        let departments = JSON.parse(localStorage.getItem("Departments"))|| []
        $('.specializationPatient ul').empty();
        departments.forEach(
            department => {
                let departmentName = `<li><a class="dropdown-item" href="#">${department}</a></li>`;
                $('.specializationPatient ul').append(departmentName);
            }
        )
    }

    // add new user
    function getFormData(formId, extraFields = {}) {
        let formData = {};
    
        $(formId + ' input').each(function () {
            let attrType = $(this).attr('type');
            let attrName = $(this).attr('name');
    
            if (attrType == 'radio') {
                if ($(this).is(':checked')) {
                    formData[attrName] = $(this).val(); 
                }
            } else {
                formData[attrName] = $(this).val();
            }
        });
        Object.assign(formData, extraFields);
        console.log(formId)
        console.log(formData)
        return formData;
    }
    $('#saveItemBtn').on('click', function () {
        let idForm = $(this).attr('data-IdForm')
        let extraData = {};
        if (selectedDoctor) extraData['doctorName'] = selectedDoctor;
        if (selectedSpecializationAppointment ) extraData['specialization'] = selectedSpecializationAppointment;
        if (selectedSpecialization) extraData['specializationPatient'] = selectedSpecialization;


        let data = getFormData(`#${idForm}`, extraData);
            if (idForm === 'patientsForm'){
                validateData('patient',data)
            } else if(idForm === 'doctorsForm'){
                validateData('doctor',data)
            }else if(idForm === 'appointmentsForm'){
                validateData('appointment',data)
            }
    });

    let selectedDoctor = '';
    let selectedSpecializationAppointment = '';
    let selectedSpecialization ='';

    $('.doctorNameAppointment ul').on('click', 'li a', function (event) {
        event.preventDefault();
        selectedDoctor = $(this).text();
        $('.dropdown-toggle-doctor').text(selectedDoctor);
    });


    $('.specializationAppointment ul').on('click', 'li a', function (event) {
        event.preventDefault();
        selectedSpecializationAppointment = $(this).text();
        $('.dropdown-toggle-specialization').text(selectedSpecializationAppointment);
    });

    $('.specializationPatient ul').on('click', 'li a', function (event) {
        event.preventDefault();
        selectedSpecialization = $(this).text();
        console.log(selectedSpecialization)
        $('.dropdown-toggle-specializationPatient').text(selectedSpecialization);
    });


    // vaildation
    function validateData(type, data) {
        let hasError = false;

        for (let key in data) {
            if (!data[key] && (key !== 'id' && key !=='idDoctor' && key !=='idAppointment'))  {
                console.log(data)
                console.log(key)
                showNotification('Please fill all fields!', 'alert-danger');
                return;
            }
        }
        switch (type) {
        case "appointment":
            hasError = validateAppointment(data);
            if (!hasError) {
                hideErrors('#dateAppointmentError, #patientNameAppointmentError');
                let appointment = {
                    //id: data.idAppointment,
                    doctorName: data.doctorName,
                    patientName: data.patientNameAppointment,
                    specialization: data.specialization,
                    date: data.dateAppointment,
                    time: data.timeAppointment,
                    status: data.statusAppointment
                };
                console.log(data)

                console.log(appointment)
                addNewItem('Appointments', appointment, appointmentsTable, ['id', 'doctorName', 'patientName', 'specialization', 'date', 'time', 'status']);
            }
            break;
        case "doctor":
            hasError = validateDoctor(data);
            if (!hasError) {
                hideErrors('#nameDoctorError, #emailDoctorError, #phoneDoctorError, #specializationDoctorError');
                let doctor = {
                    name: data.nameDoctor,
                    specialization: data.specializationDoctor,
                    email: data.emailDoctor,
                    phone: data.phoneDoctor,
                    status: data.statusDoctor
                };
                addNewItem('Doctors', doctor, doctorsTable, ['id', 'name', 'specialization', 'email', 'phone', 'status']);
            }
            break;
        case "patient":
            hasError = validatePatient(data);
            if (!hasError) {
                hideErrors(' #nameError, #phoneError, #diseaseError');
                    let patient = {
                        name: data.name,
                        age: data.age,
                        gender: data.gender,
                        phone: data.phone,
                        status: data.status,
                        disease: data.disease,
                        specializationPatient: data.specializationPatient
                    };
                    console.log(data)
                    addNewItem('Patients', patient, patientsTable, ['id', 'name', 'age', 'gender', 'phone', 'status', 'disease','specializationPatient']);
            }            
            break;
        }
    }

    function validateAppointment(data) {
        let hasError = false;
        //console.log(data)
        let namePattern = /^[a-zA-Z ]{3,}$/;

        if (!namePattern.test(data.patientNameAppointment)) {
            $('#patientNameAppointmentError').text('Please enter a valid name!').show();
            hasError = true;
        }

        let today = new Date();
        today.setHours(0, 0, 0, 0);

        let appointmentDate = new Date(data.dateAppointment);
        appointmentDate.setHours(0, 0, 0, 0);

        if (appointmentDate.getTime() < today.getTime()) {
            $('#dateAppointmentError').text('Enter a valid date!').show();
            hasError = true;
        }

        return hasError;
    }
    function validateDoctor(data) {
        let hasError = false;
        let doctors = JSON.parse(localStorage.getItem("Doctors")) || [];
    
        if (doctors.some(doctor => doctor.email === data.emailDoctor)) {
            $('#emailDoctorError').text('Email already exists!').show();
            hasError = true;
        }
        if (doctors.some(doctor => doctor.phone === data.phoneDoctor)) {
            $('#phoneDoctorError').text('Phone already exists!').show();
            hasError = true;
        }
        if (doctors.some(doctor => doctor.name === data.nameDoctor)) {
            $('#nameDoctorError').text('Name already exists!').show();
            hasError = true;
        }
    
        let patterns = {
            phone: /^01[0125][0-9]{8}$/,
            name: /^[a-zA-Z ]{3,}$/,
            email: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/,
            specialization: /^[a-zA-Z ]{3,}$/
        };
    
        if (!patterns.phone.test(data.phoneDoctor)) {
            $('#phoneDoctorError').text('Enter a valid phone number!').show();
            hasError = true;
        }
        if (!patterns.name.test(data.nameDoctor)) {
            $('#nameDoctorError').text('Enter a valid name!').show();
            hasError = true;
        }
        if (!patterns.email.test(data.emailDoctor)) {
            $('#emailDoctorError').text('Enter a valid email!').show();
            hasError = true;
        }
        if (!patterns.specialization.test(data.specializationDoctor)) {
            $('#specializationDoctorError').text('Enter a valid specialization!').show();
            hasError = true;
        }
    
        return hasError;
    }
    function validatePatient(data) {
        let hasError = false;
        let patterns = {
            phone: /^01[0125][0-9]{8}$/,
            name: /^[a-zA-Z ]{3,}$/,
            disease: /^[A-Za-z\u0600-\u06FF0-9\s\-_\/]{3,}$/
        };
    
        if (!patterns.phone.test(data.phone)) {
            $('#phoneError').text('Enter a valid phone number!').show();
            hasError = true;
        }
        if (!patterns.name.test(data.name)) {
            $('#nameError').text('Enter a valid name!').show();
            hasError = true;
        }
        if (!patterns.disease.test(data.disease)) {
            $('#diseaseError').text('Enter a valid disease name!').show();
            hasError = true;
        }
    
        return hasError;
    }

    function hideErrors(selectors) {
        $(selectors).hide();
    }    

    function addNewItem(type, item, table, fields) {

        let items = JSON.parse(localStorage.getItem(type)) || [];
    
        if (items.length > 0) {
            let lastId = items[items.length - 1].id;
            item.id = lastId + 1;
        } else {
            item.id = 1;
        }
        let lowerCaseType = type.charAt(0).toLowerCase() + type.slice(1);
        let upperCaseType = type.charAt(0).toUpperCase() + type.slice(1,-1);
        // console.log(lowerCaseType)
        // console.log(upperCaseType)

        items.push(item);
        localStorage.setItem(type, JSON.stringify(items));

        $(`#${lowerCaseType}Form`)[0].reset();
        $(`#${lowerCaseType}Modal`).modal('hide');
    
        showNotification(`${upperCaseType} added successfully!`);
        displayData(table, type, fields);
    }
    
    // delete item
    $(document).on('click', '.deleteItem' ,function (){
        let id = $(this).attr('data-id');
        let storageKey = $(this).attr('data-type');
        let columns = JSON.parse($(this).attr('data-columns')); 
        let lowerCaseType = storageKey.charAt(0).toLowerCase() + storageKey.slice(1);    
        let table = $(`#${lowerCaseType}Table`).DataTable();
        //console.log(columns,storageKey,id)
        deleteItem(id ,storageKey, columns,table);   
    })

    function deleteItem(id, storageKey , columns ,table ){
        let data = JSON.parse(localStorage.getItem(storageKey))
        let upperCaseType = storageKey.charAt(0).toUpperCase() + storageKey.slice(1,-1);
        //console.log(data)
        data =data.filter( item=> item.id!=id)
        localStorage.setItem(storageKey,JSON.stringify(data));
        showNotification(`${upperCaseType}  deleted succsessfuly!`)
        displayData( table, storageKey ,columns);
    }

    // delete all items
    $('#clearAllData').on('click', function (){
        let storageKey= $(this).attr('data-type')
        let lowerCaseType = storageKey.charAt(0).toLowerCase() + storageKey.slice(1); 
        let table = $(`#${lowerCaseType}Table`).DataTable();
        let data = JSON.parse(localStorage.getItem(storageKey)); 
        let columns = data && data.length > 0 ? Object.keys(data[0]) : [];
        //console.log(columns)
        localStorage.removeItem(storageKey);
        showNotification(`ALL ${storageKey} deleted succsessfully!`);
        displayData(table , lowerCaseType ,columns);
    })

     // Notification
    function showNotification(message,cla) {
        $('#alert')
            .text(message)
            .addClass(cla || 'alert-success')
            .hide()
            .appendTo('body')
            .fadeIn(300)
            .delay(2000)
            .fadeOut(500);
    }

    // update item
    $(document).on('click', '.editItem', function(){
        let id =Number( $(this).attr('data-id'));
        let storageKey = $(this).attr('data-type');
        let columns = JSON.parse($(this).attr('data-columns')); 

        console.log(id,storageKey,columns)
        updateItem(id,storageKey,columns)
    })
    function updateItem(id,storageKey,columns){
        let lowerCaseType = storageKey.charAt(0).toLowerCase() + storageKey.slice(1);
        $(`#${lowerCaseType}Modal`).modal('show');
        $('#saveItemBtn').hide();
        $('#updateItemBtn').removeClass('d-none').show();
        
        let data= JSON.parse(localStorage.getItem(storageKey));
        //console.log(data)
        id = Number(id);
        data = data.find(item=>item.id===id)
        //console.log(data)
        switch (storageKey){
        case "Patients" :
                $('#id').val(data.id);
                $('#name').val(data.name);
                $('#age').val(data.age);
                $('#phone').val(data.phone);
                $('#disease').val(data.disease);
                $('.dropdown-toggle-specializationPatient').text(data.specializationPatient);
                $(`input[name="gender"][value= "${data.gender}"]`).prop("checked", true);
                $(`input[name="status"][value= "${data.status}"]`).prop('checked', true)
                showItemsInDropDownListSpecialization();    
        break;
        case "Doctors" :
            $('#idDoctor').val(data.id);
            $('#nameDoctor').val(data.name);
            $('#specializationDoctor').val(data.specialization);
            $('#emailDoctor').val(data.email);
            $('#phoneDoctor').val(data.phone);
            $('#statusDoctor').val(data.status);
            $(`input[name="statusDoctor"][value= "${data.status}"]`).prop('checked', true)
        break;
        case "Appointments":
            let formattedDate = data.date.split("/").reverse().join("-"); 
            $('#idAppointment').val(data.id)
            $('#patientNameAppointment').val(data.patientName);
            $('.dropdown-toggle-doctor').text(data.doctorName);
            $('.dropdown-toggle-specialization').text(data.specialization);
            $('#timeAppointment').val(data.time);
            $('#dateAppointment').val(formattedDate);
            $(`input[name="statusAppointment"][value="${data.status}"]`).prop('checked',true);

            showItemsInDropDownListDoctorsAndSpecialization()
        break;
        };
    }
    $('#updateItemBtn').on('click', function(){

        let storageKey = $(this).attr('data-type');
        let lowerCaseTypeN = storageKey.charAt(0).toLowerCase() + storageKey.slice(1,-1);
        let lowerCaseType = storageKey.charAt(0).toLowerCase() + storageKey.slice(1);

        let item={}
        let id ;
        switch (storageKey){
            case "Patients" :
            id = parseInt($('#id').val());
            let nameP = $('#name').val();
            let age = parseInt($('#age').val());
            let phoneP = $('#phone').val();
            let disease = $('#disease').val();
            let specializationPatient = $('.dropdown-toggle-specializationPatient').text();
            let gender = $('input[name="gender"]:checked').next('label').text();
            let statusP = $('input[name="status"]:checked').next('label').text();
            item ={'id': id, "name": nameP, "age": age, "gender": gender, "phone": phoneP, "status": statusP, "disease": disease,"specializationPatient":specializationPatient }
            
            break;
            case "Doctors" :
                id = parseInt($('#idDoctor').val());
                let name = $('#nameDoctor').val();
                let specializationD = $('#specializationDoctor').val();
                let email = $('#emailDoctor').val();
                let phone = $('#phoneDoctor').val();
                let statusD = $('input[name="statusDoctor"]:checked').next('label').text();

            item = {"id": id, "name": name, "specialization": specializationD, "email": email, "phone": phone, "status": statusD}
            
            break;
            case "Appointments":
                id= parseInt($('#idAppointment').val());
                let patientName= $('#patientNameAppointment').val();
                let doctorName= $('.dropdown-toggle-doctor').text();
                let specialization = $('.dropdown-toggle-specialization').text();
                let time = $('#timeAppointment').val();
                let date = $('#dateAppointment').val();
                let status =  $(`input[name="statusAppointment"]:checked`).next('label').text()
               // let formattedDate = date.split("-").reverse().join("/"); 
                item={'id':id , 'patientName':patientName, 'doctorName':doctorName, 'specialization':specialization, 'time':time, 'date':date, 'status':status  }
            break;
        };
    let data =JSON.parse(localStorage.getItem(storageKey));
    console.log(item)
    data = data.filter(item=>item.id!=id);
        data.push(item);

    localStorage.setItem(storageKey ,JSON.stringify(data));

    showNotification(`${lowerCaseTypeN} updated succsessfully!`);
        if(storageKey==='Patients'){
            displayData(patientsTable, 'Patients', ['id', 'name', 'age', 'gender', 'phone', 'status', 'disease','specializationPatient']);

        }else if(storageKey==='Doctors'){
            displayData(doctorsTable, 'Doctors', ['id', 'name', 'specialization', 'email', 'phone', 'status']);
        }
        else if(storageKey==='Appointments'){
            displayData(appointmentsTable, 'Appointments', ['id', 'doctorName', 'patientName', 'specialization', 'date', 'time', 'status']);
        }
   // displayData(table, storageKey,columns );
    $(`#${lowerCaseType}Form`)[0].reset();
    $(`#${lowerCaseType}Modal`).modal('hide');

    })

    //-------------------------------------------------------------------------------------
    // dropdowns filter
    function applyFilter(filterId, columnIndex) {
        $('#' + filterId + ' .dropdown-item').on('click', function () {
            let selectedValue = $(this).text().trim();
            $('#' + filterId).attr('data-selected', selectedValue);
            
            $.fn.dataTable.ext.search = $.fn.dataTable.ext.search.filter(function (fn) {
                return fn.columnIndex !== columnIndex;
            });
    
            function customFilter(settings, data, dataIndex) {
                let cellValue = data[columnIndex].trim(); 
    
                if (selectedValue === "ALL" || selectedValue === "All") return true;
                
                if (filterId === "ageDropdown") {
                    let age = parseInt(cellValue);
                    if (selectedValue === "from 1 to 30") return age >= 1 && age <= 30;
                    if (selectedValue === "from 30 to 50") return age > 30 && age <= 50;
                    if (selectedValue === "max to 50") return age > 50;
                } else {
                    return cellValue === selectedValue;
                }
            }
            customFilter.columnIndex = columnIndex;
            $.fn.dataTable.ext.search.push(customFilter);
            
            patientsTable.draw(); 
        });
    }
    applyFilter("genderDropdown", 3); 
    applyFilter("ageDropdown", 2);
    applyFilter("statusDropdown", 5); 


    //------------------------------------------------------------------------appointments------------------------------------------------
    //filter
    //1- specializations filter
    let specializations = JSON.parse(localStorage.getItem('Departments'));
    if (specializations) {
        let dropdownSpe = `<li><button class="dropdown-item" data-value="All">All</button></li>`;
        $('#specializationDropdown ul').append(dropdownSpe);

        specializations.forEach(specialization => {
            let dropdownSpe = `<li><button class="dropdown-item" data-value="${specialization}">${specialization}</button></li>`;
            $('#specializationDropdown ul').append(dropdownSpe);
        });
    }

    $('#specializationDropdown').on('click', '.dropdown-item', function () {
        let specializationChoice = $(this).attr('data-value');
        $('#specializationDropdown').attr('data-selected', specializationChoice);
        $('#dropdownMenuSpecialization').text(specializationChoice);
        applyFilters();
    });

    // 2- doctors filter
    let doctors = JSON.parse(localStorage.getItem('Doctors'));
    if (doctors) {
        let dropdownDoctorsName = `<li><button class="dropdown-item" data-value="All">All</button></li>`;
        $('#doctorsNameDropdown ul').append(dropdownDoctorsName);

        doctors.forEach(doctor => {
            let dropdownDoctorsName = `<li><button class="dropdown-item" data-value="${doctor.name}">${doctor.name}</button></li>`;
            $('#doctorsNameDropdown ul').append(dropdownDoctorsName);
        });
    }

    $('#doctorsNameDropdown').on('click', '.dropdown-item', function () {
        let doctorChoice = $(this).attr('data-value');
        $('#doctorsNameDropdown').attr('data-selected', doctorChoice);
        $('#dropdownMenuDoctorsName').text(doctorChoice);
        applyFilters();
    });

    // 3- status filter
    let appointments = JSON.parse(localStorage.getItem('Appointments'));
    if (appointments) {
        let dropdownStatus = `<li><button class="dropdown-item" data-value="All">All</button></li>`;
        $('#statusAppiontmentDropdown ul').append(dropdownStatus);
        let existingStatuses = new Set();

        appointments.forEach(appointment => {
            if (!existingStatuses.has(appointment.status)) {
                existingStatuses.add(appointment.status);
                let dropdownStatus = `<li><button class="dropdown-item" data-value="${appointment.status}">${appointment.status}</button></li>`;
                $('#statusAppiontmentDropdown ul').append(dropdownStatus);
            }
        });
    }

    $('#statusAppiontmentDropdown').on('click', '.dropdown-item', function () {
        let statusChoice = $(this).attr('data-value');
        $('#statusAppiontmentDropdown').attr('data-selected', statusChoice);
        $('#dropdownMenuStatus').text(statusChoice);
        applyFilters();
    });

    function getStartEndDate(){
        let startDate= $('#startDate').val();
        let endDate =$ ('#endDate').val();
        return {'start':startDate,'end':endDate}
    }
    $('#filterDateBtn').on('click', function(){
        applyFilters()
    })
    function applyFilters() {
        let specializationChoice = $('#specializationDropdown').attr('data-selected') || "All";
        let doctorChoice = $('#doctorsNameDropdown').attr('data-selected') || "All";
        let statusChoice = $('#statusAppiontmentDropdown').attr('data-selected') || "All";

        let date=getStartEndDate()
        let startDate = date.start ? new Date(date.start) : null;
        let endDate = date.end ? new Date(date.end) : null;

        $.fn.dataTable.ext.search = []; 
        
        $.fn.dataTable.ext.search.push(function (settings, data) {
            let specialization = data[3].trim();
            let doctorName = data[1].trim();
            let status = data[6].trim();

            let dateValue  = data[4].trim().split("/").reverse().join("-");
            let dateWithFormat = new Date(dateValue);


            let specializationMatch = (specializationChoice === "All" || specialization === specializationChoice);
            let doctorMatch = (doctorChoice === "All" || doctorName === doctorChoice);
            let statusMatch = (statusChoice === "All" || status === statusChoice);

            let dateMatch = true;
            if (startDate && endDate) {
                dateMatch = (dateWithFormat >= startDate && dateWithFormat <= endDate);
            }

            return specializationMatch && doctorMatch && statusMatch && dateMatch;
        });
        appointmentTable.draw()
    };

});
