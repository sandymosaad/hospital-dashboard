$(document).ready(function () {
    let table = $('#patientsTable').DataTable();
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
    patients.forEach(patient => {
                        table.row.add([
                            patient.id,
                            patient.name,
                            patient.age,
                            patient.gender,
                            patient.address,
                            patient.phone,
                            patient.status,
                            patient.disease
                        ]).draw(); 
                    });
    }

    //get data from inputs
  

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

        let patient ={'id': id, "name": name, "age": age, "gender": gender, "address": address, "phone": phone, "status": status, "disease": disease }
        if (!id || !name || !age || !gender || !address || !phone || !status || !disease) {
            alert('Please fill all fields!');
            return;
        }
        let patients = JSON.parse(localStorage.getItem("patients"));   

        if (patients) { 
            hideErorr();
            // vaildtion 
            if (patients.some(patient => patient.id === id)) {
                $(`#idError`).text('ID already exists!').show();
                return;
            }
            
            let phonePattern = /^01[0125][0-9]{8}$/;
            if(!phonePattern.test(phone)){
                $(`#phoneError`).text('Enter Right phone number!').show();
                return;
            }

            let namePattern = /^[a-z A-Z]{3,}$/;
            if(!namePattern.test(name)){
                $(`#nameError`).text('Enter Right name!').show();
                return;
            }
            let addressPattern = /^[A-Za-z0-9\s\-_\/]{3,}$/;
            if(!addressPattern.test(address)){
                $(`#addressError`).text('Enter a valid address!').show();
                return;
            }
            let diseasePattern = /^[A-Za-z\u0600-\u06FF0-9\s\-_\/]{3,}$/;
            if(!diseasePattern.test(disease))
            {
                $(`#diseaseError`).text('Enter a valid disease name!').show();
                return;
            }
            
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
            $('#idError').hide();
            $('#nameError').hide();
            $('#phoneError').hide();
            $('#diseaseError').hide();
            $('#adressError').hide();
    }
    // function showErorr(){
    //     $('#id').on('input', function () {
    //         $('#idError').hide();
    //     });
    //     $('#name').on('input', function () {
    //         $('#nameError').hide();
    //     }); $('#phone').on('input', function () {
    //         $('#phoneError').hide();
    //     }); $('#disease').on('input', function () {
    //         $('#diseaseError').hide();
    //     });$('#adress').on('input', function () {
    //         $('#adressError').hide();
    //     });
    // }
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

    
    
});