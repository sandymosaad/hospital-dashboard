$(document).ready(function () {
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
        console.log('hoa gh hna mfesh data');
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
        console.log('hoa gh hna 3ndh  data')
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
    // Notification
    function showNotification(message) {
        let notification = $('<div class="alert alert-success position-fixed top-0 end-0 m-3"></div>')
            .text(message)
            .hide()
            .appendTo('body')
            .fadeIn(300)
            .delay(2000)
            .fadeOut(500, function () { $(this).remove(); });
    }
    
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
        let doctors = JSON.parse(localStorage.getItem('Doctors'));
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
                <button class=" btn btn-outline-warning updateDoctor" data-id="${doctor.id}">Update</button>
            </div>`

            ]);
        });
        tableOfDoctors.draw();
    }

    // delete doctor
    $('#doctorsTable tbody').on("click", ".deleteDoctor", function () {
        let id = $(this).attr('data-id');
        console.log(id)
        deleteDoctor(id);    
    })
    
    function deleteDoctor(id){
        let doctors =JSON.parse(localStorage.getItem("Doctors"));
        console.log(doctors)
        let doctorsAfterRemoveDoctor= doctors.filter(doctor=>doctor.id!=id);
        localStorage.setItem("Doctors",JSON.stringify(doctorsAfterRemoveDoctor));
        displayDoctorsData();
    }

    // add a new doctor
    function addNewDoctor(){
        let id = $('#idDoctor').val();
        console.log(id);
    }

    $('.addDoctorBtn').on('click', function(){
        addNewDoctor()
    })
});