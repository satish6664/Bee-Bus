
document.getElementById("noBus").style.display = "none";

var totalPrice = 0;
let FromLoc = '';
let ToLoc = '';
let FromTime = '';
let ToTime = '';
let DateBook = '';
let BusID = '';
let optionOfPayment = '';
let seatCount = '';
let BookedSeats = [];
let uniqueValues = [];
var selectedSeatsArray = [];
var allBusesData = []; // Variable to store all buses data

document.getElementById("AtleastMsg").style.display = "none";

fetch('/api/buses', {
    method: 'GET',
})
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        allBusesData = data; // Store all buses data
        var allValues = [];
        data.forEach(function (item) {
            allValues.push(item.from_location, item.to_location);
        });
        uniqueValues = Array.from(new Set(allValues));


        // Get today's date in yyyy:mm:dd format
        const today = new Date().toISOString().slice(0, 10);

        // Function to delete a record by its UID
        async function deleteRecord(bus_id) {
            try {
                const response = await fetch(`/api/buses/${bus_id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Failed to delete record');
                }
            } catch (error) {
                console.error(`Error deleting record with UID:`, error);
            }
        }

        // Iterate over each record and delete the ones with dates older than today's date
        data.forEach(item => {
            if (item.departure_date.slice(0, 10) < today) {
                deleteRecord(item.bus_id);
            }
        });

        // displayFilteredData(data); // Display all buses data initially
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });

function displayFilteredData(filteredData) {
    if (filteredData.length < 3) {
        footer.classList.add('fixed', 'bottom-0', 'w-full');
    }
    var busgrid = document.getElementById('busgrid');
    busgrid.innerHTML = ''; // Clear existing content

    // Loop through each item

    filteredData.forEach((item, index) => {
        // Create busInfo HTML
        let busInfo = `
        <div class="container mx-auto w-3/5 mt-8 bg-white rounded-xl shadow-md overflow-hidden p-4 bus-card">
<div class="flex justify-between items-center px-24">
    <div class="w-1/3">
        <div class="text-sm text-gray-600 ">
            <p class="font-semibold text-lg text-gray-800">${item.bus_name}</p>
            <p class="text-xs text-gray-700">${item.bus_type}</p>
        </div>
    </div>
            <div class="w-2/3 text-center">
        <div class="text-sm text-gray-600 flex items-center justify-between">
            <div>
                <p class="font-semibold text-lg text-gray-800">${item.arrival_time.slice(11, 16)}</p>
                <p class="text-xs text-gray-700">${item.from_location}</p>
            </div>
            <div class="text-2xl text-gray-600 mx-4">→</div>
            <div>
                <p class="font-semibold text-lg text-gray-800">${item.departure_time.slice(11, 16)}</p>
                <p class="text-xs text-gray-700">${item.to_location}</p>
            </div>
        </div>
    </div>
        <div class="w-1/3 flex justify-end">
        <div class="text-sm text-gray-600 ">
            <p class="text-xs text-gray-700">Starting At</p>
            <p class="font-semibold text-lg text-gray-800">₹ ${item.price}</p>
        </div>
    </div>
</div>
<div class="flex justify-end mt-6">
    <div class="w-1/3 flex justify-start items-center px-32"><span class="fa fa-star checked"> &nbsp;</span>4.3</div>
<div class="flex w-1/3 justify-center">
    <div class="text-center">
        <p class="text-lg font-semibold text-gray-800">${item.available_seats}</p>
        <p class="text-xs">  Seats Available</p>
    </div>
</div>

<div class="flex w-1/3 justify-end px-20">
    <button class="font-bold px-2 rounded book-button hover:bg-gray-300" style="border:solid black 1px;">Show Seats</button>
</div></div>
</div>
`;
        // Append busInfo to busgrid
        busgrid.innerHTML += busInfo;
    });

    // Add event listeners to the buttons after they are all appended
    const bookButtons = document.querySelectorAll('.book-button');
    bookButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            if (filteredData[index].booked_seats == null) {
                BookedSeats = [];
            }
            else {
                BookedSeats = filteredData[index].booked_seats.split(",")
            };
            FromLoc = filteredData[index].from_location;
            ToLoc = filteredData[index].to_location;
            FromTime = filteredData[index].arrival_time.slice(11, 16);
            ToTime = filteredData[index].departure_time.slice(11, 16);
            DateBook = filteredData[index].departure_date.slice(0, 10);
            busId = filteredData[index].bus_id;
            seatCount = filteredData[index].available_seats;
            // Open modal here
            openModal(filteredData[index]);
            // You can also pass data to the modal based on the button clicked
            // For example: showModalContent(filteredData[index]);
        });
    });
}
var activeInputId;

function setActiveInput(inputId) {
    activeInputId = inputId;
}

function filterOptions(inputId) {
    document.getElementById("from").style.border = "1px solid grey";
    document.getElementById("to").style.border = "1px solid grey";
    var input, filter, ul, li, i;
    input = document.getElementById(inputId);
    filter = input.value.toUpperCase();
    ul = document.getElementById("options");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        if (li[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
    if (filter === "") {
        // ul.style.display = "none";
        selectOption(event)
    } else {
        ul.style.display = "block";
    }
}

function showAllOptions(inputId) {
    var ul = document.getElementById("options");
    ul.innerHTML = ''; // Clear previous options
    // var options = ["Apple", "Orange", "Banana", "Pineapple", "Strawberry", "Grapes"];
    uniqueValues.forEach(function (option) {
        var li = document.createElement("li");
        li.textContent = option;
        ul.appendChild(li);
    });
    ul.style.display = "block";
    setActiveInput(inputId);
}

function selectOption(event) {
    document.getElementById("from").style.border = "1px solid grey";
    document.getElementById("to").style.border = "1px solid grey";
    var selectedOption = event.target;
    if (selectedOption.tagName === 'LI') {
        var input = document.getElementById(activeInputId);
        input.value = selectedOption.innerHTML;
        document.getElementById("options").style.display = "none";
    }
}

document.addEventListener('click', function (event) {
    var inputBox = document.getElementById("from");
    var inputBo = document.getElementById("to");
    var optionsList = document.getElementById("options");
    if (event.target !== inputBox && event.target !== inputBo && event.target.parentNode !== optionsList) {
        optionsList.style.display = "none";
    }
});

document.addEventListener('DOMContentLoaded', function () {
    var ul = document.getElementById("options");
    ul.addEventListener('click', selectOption);
});
// Function to open the modal
function openModal(busData) {
    document.getElementById("PriceDiv").style.display = "none";
    document.getElementById("selectedSeatsAndPriceDiv").style.display = "none";

    var selectedSeats = ["A1", "B2", "C3", "D1"]
    BookedSeatsFunction(BookedSeats);
    // selectedSeatsArray=[];
    const modal = document.getElementById('myModal');
    modal.style.display = 'block';
}

// Function to close the modal
function closeModal() {
    BookingSeats();
    const modal = document.getElementById('myModal');
    modal.style.display = 'none';
}

// Close modal when the user clicks on the close button (×)
document.querySelector('.close').addEventListener('click', closeModal);

// Close modal when the user clicks anywhere outside of the modal
window.addEventListener('click', (event) => {
    const modal = document.getElementById('myModal');
    if (event.target === modal) {
        closeModal();
    }
});

todayDate();
function todayDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    document.getElementById('date').value = today;
}

// Event listener for today button
document.getElementById('todayBtn').addEventListener('click', function () {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    document.getElementById('date').value = today;
    Calling(event)
});

// Event listener for tomorrow button
document.getElementById('tomorrowBtn').addEventListener('click', function () {
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var dd = String(tomorrow.getDate()).padStart(2, '0');
    var mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    var yyyy = tomorrow.getFullYear();
    tomorrow = yyyy + '-' + mm + '-' + dd;
    document.getElementById('date').value = tomorrow;
    Calling(event)
});

// Event listener for search button
// document.getElementById('searchBtn').addEventListener('click', 

function Calling(event) {
    event.preventDefault(); // Prevent form submission

    // Get selected options
    var fromValue = document.getElementById('from').value;
    var toValue = document.getElementById('to').value;
    var dateValue = document.getElementById('date').value;

    if (fromValue == '') {
        document.getElementById("from").style.border = "1px solid red";
        return;
    } else if (toValue == '') {
        document.getElementById("from").style.border = "1px solid grey";
        document.getElementById("to").style.border = "1px solid red";
        return;
    } else {
        document.getElementById("from").style.border = "1px solid grey";
        document.getElementById("to").style.border = "1px solid grey";
    }

    document.getElementById("section0").style.display = "none";
    document.getElementById("section1").style.display = "none";
    document.getElementById("section2").style.display = "none";

    // Filter JSON data based on selected options
    var filteredData = allBusesData.filter(function (item) {
        return item.from_location === fromValue && item.to_location === toValue && item.departure_date.slice(0, 10) === dateValue;
    });
    if (filteredData == '') {
        document.getElementById("noBus").style.display = "block";
        footer.classList.add('fixed', 'bottom-0', 'w-full');
    }
    else {
        document.getElementById("noBus").style.display = "none";
        footer.classList.remove('fixed', 'bottom-0', 'w-full');
        footer.classList.add('mt-8');
    }
    // Display filtered data
    displayFilteredData(filteredData);
};

function showPrice(event, price) {
    var seat = event.currentTarget;
    var popup = seat.querySelector('.popup');

    // Check if the seat has the class bg-gray-400
    if (!seat.classList.contains('bg-gray-400')) {
        popup.textContent = 'Price: ' + price;
        popup.style.display = 'block';
    }
}

function hidePrice(event) {
    var popup = event.currentTarget.querySelector('.popup');
    popup.textContent = '';
    popup.style.display = 'none';
}


function toggleSeat(event, seatId, seatPrice) {
    var seat = document.getElementById(seatId);
    if (seat.classList.contains('bg-gray-400')) {
        return;
    }
    if (selectedSeatsArray.length >= 1) {
        document.getElementById("AtleastMsg").style.display = "block";
    }
    document.getElementById("AtleastMsg").style.display = "none";

    document.getElementById("PriceDiv").style.display = "block";
    document.getElementById("selectedSeatsAndPriceDiv").style.display = "block";


    if (seat.classList.contains('bg-gray-50')) {
        // Check if the maximum number of seats has been reached
        if (selectedSeatsArray.length >= 4) {
            alert("Sorry, Maximum 4 seats allowed per passenger");
            return; // Exit the function if the maximum limit is reached
        }

        seat.classList.remove('bg-gray-50');
        seat.classList.add('bg-green-300'); // Change to selected color
        selectedSeatsArray.push({ id: seatId, price: seatPrice }); // Add seat to selected seats array
    } else {
        seat.classList.remove('bg-green-300'); // Revert to normal color
        seat.classList.add('bg-gray-50');
        // Remove seat from selected seats array
        selectedSeatsArray = selectedSeatsArray.filter(function (seatObj) {
            return seatObj.id !== seatId;
        });
    }

    // Update selected seats and total price display
    SelectedSeatsAndPriceDisplay();
}
function SelectedSeatsAndPriceDisplay() {

    if (selectedSeatsArray.length < 1) {
        document.getElementById("PriceDiv").style.display = "none";
        document.getElementById("selectedSeatsAndPriceDiv").style.display = "none";
    }

    var selectedSeatsDiv = document.getElementById('selectedSeatsAndPriceDiv');
    var totalPriceSpan = document.getElementById('totalPrice');
    var totalPriceBookingSpan = document.getElementById('totalPriceBooking');
    var PriceBookingSpan = document.getElementById('PriceBookingTwo');


    var selectedSeatsString = "";
    totalPrice = 0; // Reset total price


    selectedSeatsArray.forEach(function (seatObj, index) {
        selectedSeatsString += seatObj.id;
        // BookedSeats += seatObj.id;

        if (index < selectedSeatsArray.length - 1) {
            selectedSeatsString += ", ";
        }
        totalPrice += parseInt(seatObj.price);
    });

    // Update the selected seats display
    selectedSeatsDiv.innerHTML = '<p class="text-cyan-950">Selected Seats: ' + selectedSeatsString + '</p>';


    // Update the total price display
    totalPriceSpan.textContent = '₹ ' + totalPrice;

    // Update the total price Booking page
    totalPriceBookingSpan.textContent = '₹ ' + totalPrice;
    PriceBookingSpan.textContent = '₹ ' + totalPrice;


}
function openUserDetailsModal(busDataBook) {
    document.getElementById("passengerone").style.display = "none";
    document.getElementById("passengertwo").style.display = "none";
    document.getElementById("passengerthree").style.display = "none";
    document.getElementById("passengerfour").style.display = "none";
    if (selectedSeatsArray.length == 1) {
        document.getElementById("passengerone").style.display = "block";
    }
    else if (selectedSeatsArray.length == 2) {
        document.getElementById("passengerone").style.display = "block";
        document.getElementById("passengertwo").style.display = "block";
    }
    else if (selectedSeatsArray.length == 3) {
        document.getElementById("passengerone").style.display = "block";
        document.getElementById("passengertwo").style.display = "block";
        document.getElementById("passengerthree").style.display = "block";

    }
    else {
        document.getElementById("passengerone").style.display = "block";
        document.getElementById("passengertwo").style.display = "block";
        document.getElementById("passengerthree").style.display = "block";
        document.getElementById("passengerfour").style.display = "block";

    }
    // let arrayPut=[...BookedSeats, ...arrayOfIds];

    if (selectedSeatsArray.length < 1) {
        document.getElementById("AtleastMsg").style.display = "block";
        return;
    }
    const DetailsFrom = document.getElementById("DetailsFrom").innerHTML = FromLoc;
    document.getElementById("DetailsTo").innerHTML = ToLoc;
    document.getElementById("FromTime").innerHTML = FromTime;
    document.getElementById("ToTime").innerHTML = ToTime;
    document.getElementById('BookDate').innerHTML = DateBook;
    // closeModal()
    document.getElementById("myModal").style.display = "none";
    // document.getElementById("SeatsModal").style.display = "none";
    document.getElementById('userDetailsModal').classList.remove('hidden');
}

function closeUserDetailsModal() {
    BookingSeats()
    document.getElementById('userDetailsModal').classList.add('hidden');
}

function postData(event) {
    let arrayOfIds = selectedSeatsArray.map(obj => {
        BookedSeats += `,${obj.id}`
    });
    // event.preventDefault();
    const data = {
        "first_name": document.getElementById('name').value,
        "last_name": "Kali",
        "phone_number": document.getElementById('phone').value,
        "email": document.getElementById('email').value,
        "gender": document.getElementById('gender').value,
    };

    updateData()

    fetch('/api/passengers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            closeUserDetailsModal();
            alert("Ticket booked successfully!");
            location.reload();
            // Handle success response here
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            // Handle error here
        });

}
function updateData() {

    const availableSeats = seatCount - selectedSeatsArray.length;

    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ available_seats: availableSeats, booked_seats: BookedSeats })
    };
    return fetch(`/api/buses/${busId}`, requestOptions)
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error('There was a problem updating the data:', error);
        });
}

var SeatsForBook = ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3", "D1", "D2", "D3", "E1", "E2", "E3", "F1", "F2", "F3", "U1", "U2", "U3", "U4", "U5", "U6", "U7", "U8", "U9", "U10", "U11", "U12"];

function BookingSeats() {
    // Get the array of selected seats

    // Iterate over each selected seat
    SeatsForBook.forEach(function (seatId) {
        // Find the corresponding seat element in the HTML
        var seatElement = document.getElementById(seatId);

        // If the seat element exists
        if (seatElement) {
            selectedSeatsArray = [];

            // Change its background color to green
            seatElement.classList.remove('bg-gray-400');
            seatElement.classList.remove('bg-green-300');
            seatElement.classList.add('bg-gray-50'); // Add your green color class here
        }
    });
}

function BookedSeatsFunction(databook) {
    // Iterate over each selected seat
    databook.forEach(function (seatId) {
        // Find the corresponding seat element in the HTML
        var seatElement = document.getElementById(seatId);

        // If the seat element exists
        if (seatElement) {
            // Change its background color to green
            seatElement.classList.remove('bg-gray-50');
            seatElement.classList.add('bg-gray-400'); // Add your green color class here
        }
    });

}

function openPaymentForm(event) {
    event.preventDefault();
    document.getElementById('paymentSection').style.display = 'block';
    document.getElementById('ButtonPay').style.display = 'none';
    document.getElementById('PriceBooking').style.display = 'none';
}

function showPaymentDetails(paymentOption) {
    // Hide all payment details
    optionOfPayment = paymentOption;
    document.getElementById('creditCardDetails').style.display = 'none';
    document.getElementById('debitCardDetails').style.display = 'none';
    document.getElementById('upiDetails').style.display = 'none';

    // Show the selected payment details
    if (paymentOption === 'Credit Card') {
        document.getElementById('creditCardDetails').style.display = 'block';
    } else if (paymentOption === 'Debit Card') {
        document.getElementById('debitCardDetails').style.display = 'block';
    } else if (paymentOption === 'UPI') {
        document.getElementById('upiDetails').style.display = 'block';
    }
}

function HideModal() {
    document.getElementById('myModal').style.display = 'block';
    document.getElementById('userDetailsModal').classList.add('hidden');
}