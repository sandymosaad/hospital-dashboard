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

  











});    










