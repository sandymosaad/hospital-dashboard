$(document).ready(function () {
    let namePattern = /^[a-z A-Z]{3,}$/;
    //let hasError =false;

    // hospital data
    $.getJSON("js/hospitalData.json", function (data) {
            console.log(data);
            $("#totalPatients").text(data.patients);
            $("#totalDoctors").text(data.doctors);
            $("#totalAppointments").text(data.appointments);
            $("#totalDepartments").text(data.departments);

            // animating number counters
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
        }
    );

    // patients data
    let table = $('#patientsTable').DataTable();
    $.getJSON("js/patients.json", function (data) {
        let patients =JSON.parse( localStorage.getItem('patients'));
        if(!patients){
            localStorage.setItem("patients", JSON.stringify(data));
            console.log(data);
            displayPatientData();
        }else{
            displayPatientData();
        }
    });
    
    function displayPatientData() {
    let patients = JSON.parse(localStorage.getItem("patients"));
    table.clear()

    if(patients){
        patients.forEach(patient => {
            table.row.add([
                patient.id,
                patient.name,
                patient.age,
                patient.gender,
                patient.address,
                patient.phone,
                patient.status,
                patient.disease,
                `<div>   
                    <button class="btn btn-outline-danger mb-3 deletePatient" data-id="${patient.id}">Delete</button>                            
                    <button class=" btn btn-outline-warning updatePatient" data-id="${patient.id}">Update</button>
                </div>`
            ]).draw(); 
        });

    }else{
        table.row.add([
            'No Data',
            'No Data',
            'No Data',
            'No Data',
            'No Data',
            'No Data',
            'No Data',
            'No Data',
            'No Data',
        ]).draw();
 
    }
    }
    // open model for add patieb=nt
    $('.addPatientBtn').on('click', function () {
        $('#patientForm')[0].reset(); 
        $('#id').prop("readonly", false); 
        $('#savePatientBtn').show();
        $('#updatePatientBtn').addClass('d-none').hide(); 
        $('#patientModal').modal('show');
    });
    // add new patient
    $('#savePatientBtn').on('click', function () {
        let id = parseInt($('#id').val());
        let name = $('#name').val();
        let age = parseInt($('#age').val());
        let address = $('#address').val();
        let phone = $('#phone').val();
        let disease = $('#disease').val();
        let gender = $('input[name="gender"]:checked').next('label').text();
        let status = $('input[name="status"]:checked').next('label').text();

        let hasError = false;
        if (!id || !name || !age || !gender || !address || !phone || !status || !disease) {
            alert('Please fill all fields!');
            return;
        }
        let patients = JSON.parse(localStorage.getItem("patients"));   
        hideErorr();

        if (patients) { 
            // vaildtion 
            if (patients.some(patient => patient.id === id)) {
                $(`#idError`).text('ID already exists!').show();
                hasError = true;
            }  
        }          
            let phonePattern = /^01[0125][0-9]{8}$/;
            if(!phonePattern.test(phone)){
                $(`#phoneError`).text('Enter Right phone number!').show();
                hasError = true;
            }

            let namePattern = /^[a-z A-Z]{3,}$/;
            if(!namePattern.test(name)){
                $(`#nameError`).text('Enter Right name!').show();
                hasError = true;
            }
            let addressPattern = /^[A-Za-z0-9\s\-_\/]{3,}$/;
            if(!addressPattern.test(address)){
                $(`#addressError`).text('Enter a valid address!').show();
                hasError = true;
            }
            let diseasePattern = /^[A-Za-z\u0600-\u06FF0-9\s\-_\/]{3,}$/;
            if(!diseasePattern.test(disease)){
                $(`#diseaseError`).text('Enter a valid disease name!').show();
                hasError = true;
            }
            if(hasError){
                return
            }
        
            let patient ={'id': id, "name": name, "age": age, "gender": gender, "address": address, "phone": phone, "status": status, "disease": disease }
            if(patients){
            patients.push(patient);
            localStorage.setItem("patients", JSON.stringify(patients));
            } else {
                localStorage.setItem("patients", JSON.stringify([patient]));
            }
        
        $('#patientForm input, #patientForm select').val('');
        $('#patientModal').modal('hide'); 
        showNotification("Patient added successfully!");
        displayPatientData();
    });

    function hideErorr(){
        $('#idError, #nameError, #phoneError, #diseaseError, #addressError').hide();
    }
      // delete patient
    $('#patientsTable tbody').on("click", ".deletePatient", function () {
        let id = $(this).data("id");
        deletePatient(id);
    });
    function deletePatient(id){
        let patients = JSON.parse(localStorage.getItem("patients"));
        patientsAfterRemovePatient= patients.filter(patient=>patient.id!=id)
        localStorage.setItem("patients", JSON.stringify(patientsAfterRemovePatient));
        displayPatientData();
        showNotification('Patient deleted succsessfully!');
    }
    
    // update patient 
    $("#patientsTable tbody").on("click", ".updatePatient", function(){
        let id=$(this).data("id");
        //console.log(id);
        //$('#patientModal').modal('show');
        updatePatient(id);
    })
    function updatePatient(id){
        let patients = JSON.parse(localStorage.getItem("patients"));
        //console.log(id)
        //console.log(patients)
        let patientForUpdate= patients.find(patient=>patient.id===id)
        //console.log(patientForUpdate)
        if(patientForUpdate){
            $('#id').val(patientForUpdate.id).prop("readonly", true);
            $('#name').val(patientForUpdate.name);
            $('#age').val(patientForUpdate.age);
            $('#address').val(patientForUpdate.address);
            $('#phone').val(patientForUpdate.phone);
            $('#disease').val(patientForUpdate.disease);
            $(`input[name="gender"][value= "${patientForUpdate.gender}"]`).prop("checked", true);
            $(`input[name="status"][value= "${patientForUpdate.status}"]`).prop('checked', true)
        }
        $('#savePatientBtn').hide();
        $('#updatePatientBtn').removeClass('d-none').show();
        $('#patientModal').modal('show');
    }

    $('#updatePatientBtn').on('click', function(){
        let id = parseInt($('#id').val());
        let name = $('#name').val();
        let age = parseInt($('#age').val());
        let address = $('#address').val();
        let phone = $('#phone').val();
        let disease = $('#disease').val();
        let gender = $('input[name="gender"]:checked').next('label').text();
        let status = $('input[name="status"]:checked').next('label').text();
        
        let patientForUpdate ={'id': id, "name": name, "age": age, "gender": gender, "address": address, "phone": phone, "status": status, "disease": disease }
        let patients = JSON.parse(localStorage.getItem("patients"));
        patients= patients.filter(patient=>patient.id!=id);
        patients.push(patientForUpdate)
        localStorage.setItem('patients', JSON.stringify( patients))
        deletePatient();
        $('#patientModal').modal('hide');
        showNotification('Patient updated succsessfully!');
    })

    $('#deleteAllPatientsBtn').on('click', function(){
        console.log('ana yeslt 3nd el delete btn')
        localStorage.clear('patients');
        displayPatientData();
        showNotification('ALL Patients deleted succsessfully!');

    })

    
    // dropdowns filter
    $('#statusDropdown .dropdown-item').on('click', function() {
        let table = $('#patientsTable').DataTable();
        $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
            let status = (data[6]); 
            let statusChoice = $('#statusDropdown').attr('data-selected'); 
    
            if (!statusChoice || statusChoice === "ALL") {
                return true;
            } else if (statusChoice === "Stable") {
                return status === "Stable";
            } else if (statusChoice === "Recoverd") {
                return status === "Recoverd";
            } else if (statusChoice === "Under Treatment") {
                return status === "Under Treatment";
            } else if (statusChoice === "Chronic") {
                return status === "Chronic";
            }
            return false;
        });
        let statusChoice = $(this).text().trim();
        $('#statusDropdown').attr('data-selected',statusChoice);
        table.draw(); 
    });

    $('#genderDropdown .dropdown-item').on('click', function () {
        let table = $('#patientsTable').DataTable();
        $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
            let gender = (data[3]); 
            let genderChoice = $('#genderDropdown').attr('data-selected'); 
    
            if (!genderChoice || genderChoice === "ALL") {
                return true;
            } else if (genderChoice === "Male") {
                return gender === "Male";
            } else if (genderChoice === "Female") {
                return gender === "Female";
            }
            return false;
        });
        let genderChoice = $(this).text().trim();
        $('#genderDropdown').attr('data-selected',genderChoice);
        table.draw(); 
    });

    $('#ageDropdown .dropdown-item').on('click', function () {
        let table = $('#patientsTable').DataTable();
        $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
            let age = parseInt(data[2]); 
            let ageRange = $('#ageDropdown').attr('data-selected'); 
    
            if (!ageRange || ageRange === "All") {
                return true; 
            } else if (ageRange === "from 1 to 30") {
                return age >= 1 && age <= 30;
            } else if (ageRange === "from 30 to 50") {
                return age > 30 && age <= 50;
            } else if (ageRange === "max to 50") {
                return age > 50;
            }
            return false;
        });
        let ageRange = $(this).text().trim();
        $('#ageDropdown').attr('data-selected', ageRange); 
        table.draw(); 
    });

    //---------------------------------------------------------------doctors-----------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------------------------------
    //----------------------------------------------------------------------------------------------------------------------

    let tableOfDoctors = $('#doctorsTable').DataTable();
    $.getJSON('js/doctors.json', function(doctorsData){
        let doctors= JSON.parse(localStorage.getItem('Doctors'));
        if(!doctors){
            localStorage.setItem('Doctors',JSON.stringify(doctorsData));
        }
        displayDoctorsData();
    })
    function displayDoctorsData(){
        let doctors = JSON.parse(localStorage.getItem('Doctors')) ;
        //console.log(doctors);
        if(doctors=== null){
            tableOfDoctors.clear();
        }else{
            tableOfDoctors.clear();
            doctors.forEach(doctor => {
                tableOfDoctors.row.add([
                    doctor.id,
                    doctor.name,
                    doctor.specialization,
                    doctor.email,
                    doctor.phone,
                    doctor.status,
                    `<div>   
                    <button class="btn btn-outline-danger  deleteDoctor" data-id="${doctor.id}">Delete</button>                            
                    <button class=" btn btn-outline-warning editDoctor" data-id="${doctor.id}">Edit</button>
                </div>`
                ]);
            });
        } tableOfDoctors.draw();
        
    }
    // reset form
    $('#addDoctorBtn').on('click', function(){
        $('#doctorForm')[0].reset();
        $('#updateDoctorBtn').addClass('d-none').hide();
        $('#saveDoctorBtn').show();
    })
    // add a new doctor
    $('#saveDoctorBtn').on('click', function(){        
        getDoctorDataInput()
    })
    function getDoctorDataInput(){
    let doctorData={}
    $('#doctorForm input').each(function(){
        let attrType= $(this).attr('type');
        let attrName= $(this).attr('name');

        if(attrType=='radio'){
            if($(this).is(':checked')){
                doctorData[attrName]=$(this).val();
            }
        }else{
            doctorData[attrName]=$(this).val();
        }
    })
    //console.log(doctorData);
    vailditonDoctorData(doctorData);
    }
    function vailditonDoctorData(data){
        if(   !data.nameDoctor || !data.emailDoctor || !data.phoneDoctor || !data.specializationDoctor || !data.statusDoctor){
            showNotification('Please fill all fields!','alert-danger');
            return;
        }
        let hasError = false;
        let doctors =JSON.parse(localStorage.getItem("Doctors"));
        if(doctors){
            if(doctors.some(doctor=>doctor.email==data.emailDoctor)){
                $(`#emailDoctorError`).text('Email already exists!').show();
                hasError = true;
            }
            if(doctors.some(doctor=>doctor.phone==data.phoneDoctor)){
                $(`#phoneDoctorError`).text('Phone already exists!').show();
                hasError = true;
            }
            if(doctors.some(doctor=>doctor.name==data.nameDoctor)){
                $(`#nameDoctorError`).text('Name already exists!').show();
                hasError = true;
            }
        }
        let phonePattern = /^01[0125][0-9]{8}$/;
        if(!phonePattern.test(data.phoneDoctor)){
            $(`#phoneError`).text('Enter Right phone number!').show();
            hasError = true;
        }
        let namePattern = /^[a-z A-Z]{3,}$/;
        if(!namePattern.test(data.nameDoctor)){
            $(`#nameDoctorError`).text('Enter Right name!').show();
            hasError = true;
        }
        let emailPattern = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
        if(!emailPattern.test(data.emailDoctor)){
            $(`#emailDoctorError`).text('Enter Right email!').show();
            hasError = true;
        }
        let specializationPattern = /^[a-z A-Z]{3,}$/;
        if(!specializationPattern.test(data.specializationDoctor)){
            $(`#specializationDoctorError`).text('Enter Right specialization!').show();
            hasError = true;
        }
        if(hasError){
            return
        }else{
            let doctor= {
                "id": data.idDoctor,
                "name": data.nameDoctor,
                "specialization": data.specializationDoctor,
                "email": data.emailDoctor,
                "phone": data.phoneDoctor,
                "status": data.statusDoctor
            }
            hideDoctorErorr();
            addNewDoctor(doctor);
        }
    }
    function addNewDoctor(doctor){
        let doctors =JSON.parse(localStorage.getItem("Doctors"));
        //console.log(doctors)
        if(doctors.length>0){
            let lastId= doctors[doctors.length-1].id
            doctor['id']=lastId+1 
            doctors.push(doctor);
            localStorage.setItem("Doctors",JSON.stringify(doctors));
        }else{
            doctor['id']=1 
           // console.log(doctor);
            let doctors=[doctor];
            localStorage.setItem("Doctors",JSON.stringify(doctors));
        }
        $('#doctorForm')[0].reset();
        $('#doctorModal').modal('hide');
        showNotification('Doctor added succsessfully!');
        displayDoctorsData();
    }
    function hideDoctorErorr(){
        $('#nameDoctorError, #emailDoctorError, #phoneDoctorError, #specializationDoctorError').hide();
    }

    // delete doctor
    $('#doctorsTable tbody').on("click", ".deleteDoctor", function () {
        let id = $(this).attr('data-id');
        deleteDoctor(id);    
    })
    
    function deleteDoctor(id){
        let doctors =JSON.parse(localStorage.getItem("Doctors"));
        let doctorsAfterRemoveDoctor= doctors.filter(doctor=>doctor.id!=id);
        localStorage.setItem("Doctors",JSON.stringify(doctorsAfterRemoveDoctor));
        showNotification('Doctor deleted succsessfully!');
        displayDoctorsData();
    }

    // clear all data 
    $('#deleteAllDoctorsBtn').on('click', function () {
        localStorage.clear('Doctors');
        displayDoctorsData();
        showNotification('ALL Doctors deleted succsessfully!');
    })
    // edit doctor
    $('#doctorsTable tbody').on("click", ".editDoctor", function () {
        let id = $(this).attr('data-id');
        updateDoctor(id);
    })

    function updateDoctor(id){
        let doctors =JSON.parse(localStorage.getItem("Doctors"));
        let doctor = doctors.find(doctor=>doctor.id==id);
        $('#idDoctor').val(doctor.id);
        $('#nameDoctor').val(doctor.name);
        $('#specializationDoctor').val(doctor.specialization);
        $('#emailDoctor').val(doctor.email);
        $('#phoneDoctor').val(doctor.phone);
        $('#statusDoctor').val(doctor.status);
        $(`input[name="statusDoctor"][value= "${doctor.status}"]`).prop('checked', true)

        $('#saveDoctorBtn').hide();
        $('#updateDoctorBtn').removeClass('d-none').show();
        $('#doctorModal').modal('show');
    }

    $('#updateDoctorBtn').on('click', function () {
        let id = ($('#idDoctor').val());
        let name = $('#nameDoctor').val();
        let specialization = $('#specializationDoctor').val();
        let email = $('#emailDoctor').val();
        let phone = $('#phoneDoctor').val();
        let status = $('input[name="statusDoctor"]:checked').next('label').text();

        let  doctor = {"id": id, "name": name, "specialization": specialization, "email": email, "phone": phone, "status": status }
        let doctors =JSON.parse(localStorage.getItem("Doctors"));
        doctors = doctors.filter(doctor=>doctor.id!=id);
        doctors.push(doctor);

        localStorage.setItem("Doctors",JSON.stringify(doctors));
        console.log(doctor);
        showNotification('Doctor updated succsessfully!');
        displayDoctorsData();
        $('#doctorForm')[0].reset();
        $('#doctorModal').modal('hide');
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
    
    //------------------------------------------------------------------------appointments------------------------------------------------
    //------------------------------------------------------------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------------------------------------------------------

    let hospitalDepartments=["Emergency", 'Cardiology', 'Dental', 'Physical Therapy',' General Surgery'];
    localStorage.setItem('Departments',JSON.stringify(hospitalDepartments));

    let appointmentTable=$('#appointmentsTable').DataTable()
    $.getJSON('js/appointment.json',function(data){
      //      console.log(data)
    let appointments = JSON.parse(localStorage.getItem('Appointments'));
    if (!appointments){
        localStorage.setItem("Appointments",JSON.stringify(data))
    }
    displayAppointmentsData();
    })
    function displayAppointmentsData(){
        let appointments= JSON.parse(localStorage.getItem("Appointments"));
        appointmentTable.clear()
        appointments.forEach(appointment=>
            appointmentTable.row.add([
                appointment.id,
                appointment.doctorName,
                appointment.patientName,
                appointment.specialization,
                appointment.date,
                appointment.time,
                appointment.status,
                `<div>   
                    <button class="btn btn-outline-danger  deleteAppointment" data-id="${appointment.id}">Delete</button>                            
                    <button class=" btn btn-outline-warning editAppointment" data-id="${appointment.id}">Edit</button>
                </div>`
            ]).draw()
        )
    }

    // add a new appointment 
    
    $('#addAppointmentBtn').on('click', function(){      
        let doctors=JSON.parse(localStorage.getItem('Doctors')) || [];
        doctorsName=[],
        $('.doctorName ul').empty();
        doctors.forEach(
            doctor => {
                doctorsName.push(doctor.name);
                // console.log(doctor.name)
                //
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
    })

    let selectedDoctor = ''; 
    let selectedSpecializationAppointment = '';
    $('.doctorNameAppointment ul').on('click', 'li a', function (event) {
        event.preventDefault();
        selectedDoctor = $(this).text(); 
        $('.dropdown-toggle-doctor').text(selectedDoctor); 
    });
    $('.specializationAppointment ul').on('click', 'li a', function(event){
        event.preventDefault();
        selectedSpecializationAppointment = $(this).text();
        $('.dropdown-toggle-specialization').text(selectedSpecializationAppointment);
    })
    function getAppointmentDataInput(){
        let patientName=$('#patientNameAppointment').val();
        let date=$('#dateAppointment').val();
        let time=$('#timeAppointment').val();
        let status =$('input[name="statusAppointment"]:checked').next("label").text()
        let appointmet={'patientName':patientName,'doctorName':selectedDoctor,'date':date,'time':time, 'specialization':selectedSpecializationAppointment, 'status':status}
    console.log(date)
    vailditonAppointmentData(appointmet);
    }

    function vailditonAppointmentData(appointmentData){
        // if(!appointmentData.patientName | !appointmentData.doctorName| !appointmentData.date |!appointmentData.time | !appointmentData.specialization){
        //     showNotification('Please fill all fields!','alert-danger');
        //     return;
        // }
        hasError= false
        if(!namePattern.test(appointmentData.patientName)){
            $('#patientNameAppointmentError').text('Please Enter Vaild Name!').show()
            hasError=true;
        }
        let today = new Date();
        today.setHours(0, 0, 0, 0);

        let appointmentDate = new Date(appointmentData.date);
        appointmentDate.setHours(0, 0, 0, 0); 

        if (appointmentDate.getTime() < today.getTime()) {
            $('#dateAppointmentError').text('Enter a valid date!').show();
            hasError = true;
        } else {
            console.log('Valid date selected');
        }

        if(hasError){
            return;
        }else{
            let selectedDate =appointmentDate.toLocaleDateString('en-GB')
            let appointmet={'doctorName':selectedDoctor,'patientName':appointmentData.patientName,'specialization':selectedSpecializationAppointment ,'date':selectedDate,'time':appointmentData.time,'status':appointmentData.status}
            hideAppointmentErorr();
            addAppointment(appointmet);
           // console.log(appointmet)
        }

    }
    function addAppointment(appointment){
        //console.log(appointment)
        let appointments = JSON.parse(localStorage.getItem('Appointments'))
            console.log(appointments)
        if(appointments){
            lastId= appointments[appointments.length-1].id
            appointment.id=lastId+1
            appointments.push(appointment);
            localStorage.setItem('Appointments',JSON.stringify(appointments));
        }else{
            console.log('......')
        }
        $('#appointmentForm')[0].reset();
        $('#appointmentModal').modal('hide');
        showNotification("Appointment added successfuly!");
        displayAppointmentsData();

    }
    function hideAppointmentErorr(){
        $('#dateAppointmentError, #patientNameAppointmentError').hide();
    }
    $('#saveAppointmentBtn').on('click', function(){
        getAppointmentDataInput()
        // console.log('---save---')
        // console.log (appointmet)
    })


































    
});