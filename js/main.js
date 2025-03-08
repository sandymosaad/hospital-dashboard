$(document).ready(function () {
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

    $.getJSON("js/patients.json", function (data) {
            $("#patientsTable").DataTable({
                data: data,
                columns: [
                    { data: "id" },
                    { data: "name" },
                    { data: "age" },
                    { data: "gender" },
                    { data: "address" },
                    { data: "phone" },
                    { data: "status" },
                    { data: "disease" },
                ],
            });
    });


    $('#statusDropdown .dropdown-item').on('click', function() {
        let status = $(this).text();
        let table = $('#patientsTable').DataTable();
        table.column(6).search(status).draw();
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










