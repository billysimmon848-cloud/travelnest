/* =========================================================
   FLIGHT TRACKING WEBSITE
========================================================= */

const API_URL =
  'https://api.justdoks.com/api';


/* =========================================================
   ELEMENTS
========================================================= */

const trackingForm =
  document.getElementById('trackingForm');


const trackingNumberInput =
  document.getElementById('trackingNumber');


const trackButton =
  document.getElementById('trackButton');


const trackingMessage =
  document.getElementById('trackingMessage');


const trackingEmpty =
  document.getElementById('trackingEmpty');


const flightResult =
  document.getElementById('flightResult');

const boardingPassResult =
  document.getElementById('boardingPassResult');


const boardingPassStatus =
  document.getElementById('boardingPassStatus');


const boardingPassFrom =
  document.getElementById('boardingPassFrom');


const boardingPassTo =
  document.getElementById('boardingPassTo');


const boardingPassName =
  document.getElementById('boardingPassName');


const boardingPassTrackingNumber =
  document.getElementById('boardingPassTrackingNumber');


const boardingPassDate =
  document.getElementById('boardingPassDate');


const boardingPassTime =
  document.getElementById('boardingPassTime');


const boardingPassTimeDetail =
  document.getElementById('boardingPassTimeDetail');


const boardingPassDuration =
  document.getElementById('boardingPassDuration');


const boardingPassClass =
  document.getElementById('boardingPassClass');


const boardingPassGate =
  document.getElementById('boardingPassGate');


const boardingPassSeat =
  document.getElementById('boardingPassSeat');


const boardingPassSequence =
  document.getElementById('boardingPassSequence');


const boardingPassLastUpdated =
  document.getElementById('boardingPassLastUpdated');


const resultAirline =
  document.getElementById('resultAirline');


const resultTrackingNumber =
  document.getElementById('resultTrackingNumber');


const resultStatus =
  document.getElementById('resultStatus');


const resultDepartureAirport =
  document.getElementById('resultDepartureAirport');


const resultDestinationAirport =
  document.getElementById('resultDestinationAirport');


const resultDepartureTime =
  document.getElementById('resultDepartureTime');


const resultDepartureTimeDetail =
  document.getElementById('resultDepartureTimeDetail');


const resultFlightNumber =
  document.getElementById('resultFlightNumber');


const resultPassengerName =
  document.getElementById('resultPassengerName');


const resultTravelDate =
  document.getElementById('resultTravelDate');


const resultFlightDuration =
  document.getElementById('resultFlightDuration');


const resultTerminal =
  document.getElementById('resultTerminal');


const resultSeat =
  document.getElementById('resultSeat');


const resultFlightClass =
  document.getElementById('resultFlightClass');


const resultGroup =
  document.getElementById('resultGroup');


const resultBookingReference =
  document.getElementById('resultBookingReference');


const lastUpdated =
  document.getElementById('lastUpdated');


const flightError =
  document.getElementById('flightError');


const flightErrorMessage =
  document.getElementById('flightErrorMessage');


const progressLine =
  document.getElementById('progressLine');


const progressSteps =
  document.querySelectorAll(
    '.progress-step'
  );


const currentJourneyStatus =
  document.getElementById(
    'currentJourneyStatus'
  );


const heroContent =
  document.querySelector(
    '.hero-content'
  );


/* =========================================================
   FREE / TEST POPUP
========================================================= */

const flightAccessPopup =
  document.getElementById(
    'flightAccessPopup'
  );


const flightPopupTitle =
  document.getElementById(
    'flightPopupTitle'
  );


const flightPopupMessage =
  document.getElementById(
    'flightPopupMessage'
  );


/*
  Stores the currently displayed flight.

  This lets the popup timer check whether
  the flight is still free/test before
  showing the popup again.
*/

let currentTrackedFlight =
  null;


/*
  Stores the timer used to reopen the
  free-flight popup after 30 seconds.
*/

let freeFlightPopupTimer =
  null;


/* =========================================================
   MOVE RESULT INTO HERO
========================================================= */

function showFlightResult() {

  if (!heroContent) {
    return;
  }


  heroContent.appendChild(
    flightResult
  );


  flightResult.classList.remove(
    'hidden'
  );


  if (trackingEmpty) {

    trackingEmpty.classList.add(
      'hidden'
    );

  }

}


/* =========================================================
   HIDE FLIGHT RESULT
========================================================= */

function hideFlightResult() {

  if (!flightResult) {
    return;
  }


  flightResult.classList.add(
    'hidden'
  );

}

/* =========================================================
   SHOW BOARDING PASS RESULT
========================================================= */

function showBoardingPassResult() {

  if (!boardingPassResult) {
    return;
  }


  if (heroContent) {

    heroContent.appendChild(
      boardingPassResult
    );

  }


  boardingPassResult.classList.remove(
    'hidden'
  );


  if (trackingEmpty) {

    trackingEmpty.classList.add(
      'hidden'
    );

  }

}


/* =========================================================
   HIDE BOARDING PASS RESULT
========================================================= */

function hideBoardingPassResult() {

  if (!boardingPassResult) {
    return;
  }


  boardingPassResult.classList.add(
    'hidden'
  );

}


/* =========================================================
   CLEAR FREE FLIGHT POPUP TIMER
========================================================= */

function clearFreeFlightPopupTimer() {

  if (
    freeFlightPopupTimer
  ) {

    clearTimeout(
      freeFlightPopupTimer
    );


    freeFlightPopupTimer =
      null;

  }

}


/* =========================================================
   SHOW FLIGHT ACCESS POPUP
========================================================= */

function showFlightAccessPopup(
  title,
  message
) {

  if (
    !flightAccessPopup ||
    !flightPopupTitle ||
    !flightPopupMessage
  ) {

    return;

  }


  flightPopupTitle.textContent =
    title;


  flightPopupMessage.textContent =
    message;


  flightAccessPopup.classList.remove(
    'hidden'
  );

}


/* =========================================================
   CLOSE FLIGHT ACCESS POPUP
========================================================= */

function closeFlightAccessPopup() {

  if (!flightAccessPopup) {
    return;
  }


  flightAccessPopup.classList.add(
    'hidden'
  );


  /*
    After Continue or Close is clicked,
    start the 30-second countdown again.

    The timer itself checks the current
    flight before reopening the popup.
  */

  startFreeFlightPopupTimer();

}


/* =========================================================
   START FREE FLIGHT POPUP TIMER
========================================================= */

function startFreeFlightPopupTimer() {

  clearFreeFlightPopupTimer();


  if (
    !currentTrackedFlight
  ) {

    return;

  }


  /*
    Only free/test flights with an
    active watermark should have
    the repeating popup.
  */

  if (
    currentTrackedFlight.flightType !==
    'test' ||
    currentTrackedFlight.watermarkEnabled !==
    true
  ) {

    return;

  }


  freeFlightPopupTimer =
    setTimeout(
      async function () {

        /*
          Check the latest flight information
          from the server before showing the
          popup again.

          This prevents the popup from
          appearing if the flight was paid
          for during the 30-second wait.
        */

        const trackingNumber =
          currentTrackedFlight.trackingNumber;


        if (
          !trackingNumber
        ) {

          return;

        }


        try {

          const response =
            await fetch(
              `${API_URL}/flights/track/${encodeURIComponent(trackingNumber)}`
            );


          const data =
            await response.json();


          if (
            !response.ok ||
            !data.flight
          ) {

            return;

          }


          /*
            Replace the stored flight with
            the latest database version.
          */

          currentTrackedFlight =
            data.flight;


          /*
            Flight is now paid/clean.

            Do not show the popup.
          */

          if (
            currentTrackedFlight.flightType !==
            'test' ||
            currentTrackedFlight.watermarkEnabled !==
            true
          ) {

            return;

          }


          /*
            Flight is still free/test.

            Show the popup again.
          */

          showFlightAccessPopup(
            'Free Flight Tracking',
            'This flight was created using the free flight profile. You can view the available tracking information here.'
          );


        } catch (error) {

          /*
            If the server cannot be reached,
            do not force the popup open.
          */

          return;

        }

      },
      30000
    );

}


/* =========================================================
   TRACK FLIGHT / BOARDING PASS
========================================================= */

trackingForm.addEventListener(
  'submit',
  async function (event) {

    event.preventDefault();


    clearFreeFlightPopupTimer();

    closeFlightAccessPopup();


    const trackingNumber =
      trackingNumberInput.value
        .trim()
        .toUpperCase();


    if (!trackingNumber) {

      trackingMessage.textContent =
        'Please enter a tracking number.';


      hideFlightResult();

      hideBoardingPassResult();


      currentTrackedFlight =
        null;


      return;

    }


    trackingMessage.textContent =
      'Searching...';


    trackButton.disabled =
      true;


    trackButton.textContent =
      'Searching...';


    hideFlightResult();

    hideBoardingPassResult();


    try {

      /* =====================================================
         TRY FLIGHT FIRST
      ===================================================== */

      const flightResponse =
        await fetch(
          `${API_URL}/flights/track/${encodeURIComponent(trackingNumber)}`
        );


      if (
        flightResponse.ok
      ) {

        const flightData =
          await flightResponse.json();


        if (
          flightData.flight
        ) {

          currentTrackedFlight =
            flightData.flight;


          renderFlight(
            flightData.flight
          );


          trackingMessage.textContent =
            '';


          showFlightResult();


          return;

        }

      }


      /* =====================================================
         TRY BOARDING PASS SECOND
      ===================================================== */

      const boardingPassResponse =
        await fetch(
          `${API_URL}/boardingPass/track/${encodeURIComponent(trackingNumber)}`
        );


      if (
        boardingPassResponse.ok
      ) {

        const boardingPassData =
          await boardingPassResponse.json();


        if (
          boardingPassData.boardingPass
        ) {

          renderBoardingPass(
            boardingPassData.boardingPass
          );


          trackingMessage.textContent =
            '';


          currentTrackedFlight =
            null;


          hideFlightResult();

          showBoardingPassResult();


          return;

        }

      }


      throw new Error(
        'Tracking number not found.'
      );

    }

    catch (error) {

      trackingMessage.textContent =
        error.message ||
        'Unable to find this tracking number.';


      hideFlightResult();

      hideBoardingPassResult();


      currentTrackedFlight =
        null;

    }

    finally {

      trackButton.disabled =
        false;


      trackButton.textContent =
        'Track Flight';

    }

  }
);


/* =========================================================
   RENDER FLIGHT
========================================================= */

function renderFlight(flight) {

  /*
    Keep the latest flight information
    available to the popup timer.
  */

  currentTrackedFlight =
    flight;


  resultAirline.textContent =
    flight.airline ||
    'My Flight company';


  resultTrackingNumber.textContent =
    flight.trackingNumber ||
    '--';


  resultDepartureAirport.textContent =
    flight.departureAirport ||
    '--';


  resultDestinationAirport.textContent =
    flight.destinationAirport ||
    '--';


  resultDepartureTime.textContent =
    flight.departureTime ||
    '--';


  resultDepartureTimeDetail.textContent =
    flight.departureTime ||
    '--';


  resultFlightNumber.textContent =
    flight.flightNumber ||
    '--';


  resultPassengerName.textContent =
    flight.passengerName ||
    '--';


  resultTravelDate.textContent =
    formatDate(
      flight.travelDate
    );


  /* =======================================================
     FLIGHT DURATION
  ====================================================== */

  if (resultFlightDuration) {

    resultFlightDuration.textContent =
      flight.flightDuration
        ? `${flight.flightDuration} Hours`
        : '--';

  }


  resultTerminal.textContent =
    flight.terminal ||
    '--';


  resultSeat.textContent =
    flight.seat ||
    '--';


  resultFlightClass.textContent =
    flight.flightClass ||
    '--';


  resultGroup.textContent =
    flight.group ||
    '--';


  resultBookingReference.textContent =
    flight.bookingReference ||
    '--';


  updateStatus(
    flight.currentStatus
  );


  updateError(
    flight
  );


  updateLastUpdated(
    flight
  );


  /* =======================================================
     FREE / TEST FLIGHT POPUP

     Popup appears immediately for:

     1. Test/free flight
     2. Watermark enabled

     After the popup is closed, another
     popup will appear after 30 seconds.

     If the flight is paid before the
     30 seconds finishes, the popup
     will not appear again.
  ====================================================== */

  if (
    flight.flightType === 'test' &&
    flight.watermarkEnabled === true
  ) {

    showFlightAccessPopup(
      'Free Flight Tracking',
      'This flight was created using the free flight profile. You can view the available tracking information here.'
    );


    startFreeFlightPopupTimer();

  }

  else {

    clearFreeFlightPopupTimer();

    closeFlightAccessPopup();

  }

}

/* =========================================================
   RENDER BOARDING PASS
========================================================= */

function renderBoardingPass(
  boardingPass
) {

  boardingPassTrackingNumber.textContent =
    boardingPass.trackingNumber ||
    '--';


  boardingPassFrom.textContent =
    boardingPass.from ||
    '--';


  boardingPassTo.textContent =
    boardingPass.to ||
    '--';


  boardingPassName.textContent =
    boardingPass.name ||
    '--';


  boardingPassDate.textContent =
    formatDate(
      boardingPass.date
    );


  boardingPassTime.textContent =
    boardingPass.time ||
    '--';


  boardingPassTimeDetail.textContent =
    boardingPass.time ||
    '--';


  boardingPassDuration.textContent =
    boardingPass.duration ||
    '--';


  boardingPassClass.textContent =
    boardingPass.class ||
    '--';


  boardingPassGate.textContent =
    boardingPass.gate ||
    '--';


  boardingPassSeat.textContent =
    boardingPass.seat ||
    '--';


  boardingPassSequence.textContent =
    boardingPass.sequence ||
    '--';


  updateBoardingPassStatus(
    boardingPass.currentStatus
  );


  const latestDate =
    new Date(
      boardingPass.updatedAt ||
      boardingPass.createdAt
    );


  if (
    !isNaN(
      latestDate.getTime()
    )
  ) {

    boardingPassLastUpdated.textContent =
      `Last updated ${formatDateTime(latestDate)}`;

  }

  else {

    boardingPassLastUpdated.textContent =
      '';

  }

}


/* =========================================================
   STATUS
========================================================= */

function updateStatus(status) {

  const currentStatus =
    status ||
    'Processing';


  resultStatus.textContent =
    currentStatus;


  resultStatus.className =
    'flight-status';


  /* =======================================================
     ARRIVED / COMPLETED
  ====================================================== */

  if (
    currentStatus === 'Arrived' ||
    currentStatus === 'Completed'
  ) {

    resultStatus.style.background =
      'rgba(39, 128, 94, 0.2)';

    resultStatus.style.color =
      '#8ed4b3';

  }


  /* =======================================================
     ACTIVE FLIGHT
  ====================================================== */

  else if (
    currentStatus === 'Boarding' ||
    currentStatus === 'Departed' ||
    currentStatus === 'In Transit'
  ) {

    resultStatus.style.background =
      'rgba(23, 111, 120, 0.25)';

    resultStatus.style.color =
      '#9bd6da';

  }


  /* =======================================================
     DELAYED
  ====================================================== */

  else if (
    currentStatus === 'Delayed'
  ) {

    resultStatus.style.background =
      'rgba(190, 137, 42, 0.2)';

    resultStatus.style.color =
      '#f0c56b';

  }


  /* =======================================================
     CANCELLED
  ====================================================== */

  else if (
    currentStatus === 'Cancelled'
  ) {

    resultStatus.style.background =
      'rgba(185, 77, 67, 0.25)';

    resultStatus.style.color =
      '#ffaaa3';

  }


  /* =======================================================
     REFUNDED
  ====================================================== */

  else if (
    currentStatus === 'Refunded'
  ) {

    resultStatus.style.background =
      'rgba(130, 91, 160, 0.25)';

    resultStatus.style.color =
      '#d5b5ed';

  }


  /* =======================================================
     PROCESSING / CONFIRMED / CHECKED IN
  ====================================================== */

  else {

    resultStatus.style.background =
      'rgba(255,255,255,0.1)';

    resultStatus.style.color =
      '#c7dbde';

  }


  updateProgress(
    currentStatus
  );

}


/* =========================================================
   JOURNEY PROGRESS

   ALWAYS:

   Processing
        ↓
   Confirmed
        ↓
   Current Status

========================================================= */

function updateProgress(status) {

  if (
    progressSteps.length < 3
  ) {

    return;

  }


  /* =======================================================
     RESET
  ====================================================== */

  progressSteps.forEach(
    function (step) {

      step.classList.remove(
        'active'
      );


      step.classList.remove(
        'completed'
      );

    }
  );


  /* =======================================================
     THIRD STAGE TEXT
  ====================================================== */

  let thirdStatus =
    status ||
    'Completed';


  if (
    thirdStatus === 'Processing'
  ) {

    thirdStatus =
      'Completed';

  }


  if (currentJourneyStatus) {

    currentJourneyStatus.textContent =
      thirdStatus;

  }


  /* =======================================================
     PROCESSING
  ====================================================== */

  if (
    status === 'Processing'
  ) {

    progressSteps[0]
      .classList.add(
        'active'
      );


    progressLine.style.background =
      'linear-gradient(to right, #176f78 0%, #dce3e5 0%)';


    return;

  }


  /* =======================================================
     CONFIRMED
  ====================================================== */

  if (
    status === 'Confirmed'
  ) {

    progressSteps[0]
      .classList.add(
        'completed'
      );


    progressSteps[1]
      .classList.add(
        'active'
      );


    progressLine.style.background =
      'linear-gradient(to right, #176f78 50%, #dce3e5 50%)';


    return;

  }


  /* =======================================================
     ALL OTHER CURRENT STATUSES

     Processing = completed
     Confirmed = completed
     Current Status = active

  ====================================================== */

  progressSteps[0]
    .classList.add(
      'completed'
    );


  progressSteps[1]
    .classList.add(
      'completed'
    );


  progressSteps[2]
    .classList.add(
      'active'
    );


  progressLine.style.background =
    '#176f78';

}


/* =========================================================
   FLIGHT UPDATE MESSAGE
========================================================= */

function updateError(flight) {

  const status =
    flight.currentStatus;


  /* =======================================================
     DELAYED
  ====================================================== */

  if (
    status === 'Delayed'
  ) {

    flightError.classList.remove(
      'hidden'
    );


    flightErrorMessage.textContent =
      flight.errorMessage ||
      'This flight has been delayed. Please check the latest available information.';


    return;

  }


  /* =======================================================
     CANCELLED
  ====================================================== */

  if (
    status === 'Cancelled'
  ) {

    flightError.classList.remove(
      'hidden'
    );


    flightErrorMessage.textContent =
      flight.errorMessage ||
      'This flight has been cancelled. Please check the latest available information.';


    return;

  }


  /* =======================================================
     REFUNDED
  ====================================================== */

  if (
    status === 'Refunded'
  ) {

    flightError.classList.remove(
      'hidden'
    );


    flightErrorMessage.textContent =
      flight.errorMessage ||
      'This flight has been refunded. Please check the latest available information.';


    return;

  }


  /* =======================================================
     NORMAL STATUS
  ====================================================== */

  flightError.classList.add(
    'hidden'
  );


  flightErrorMessage.textContent =
    '';

}


/* =========================================================
   LAST UPDATED
========================================================= */

function updateLastUpdated(flight) {

  let latestDate =
    null;


  /*
    Public flight tracking does not use
    tracking history.

    The latest database update is used
    instead.
  */

  latestDate =
    new Date(
      flight.updatedAt ||
      flight.createdAt
    );


  if (
    latestDate &&
    !isNaN(
      latestDate.getTime()
    )
  ) {

    lastUpdated.textContent =
      `Last updated ${formatDateTime(latestDate)}`;

  }

  else {

    lastUpdated.textContent =
      '';

  }

}


/* =========================================================
   DATE
========================================================= */

function formatDate(dateValue) {

  if (!dateValue) {

    return '--';

  }


  const date =
    new Date(
      dateValue
    );


  if (
    isNaN(
      date.getTime()
    )
  ) {

    return dateValue;

  }


  return date.toLocaleDateString(
    undefined,
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }
  );

}


/* =========================================================
   DATE + TIME
========================================================= */

function formatDateTime(dateValue) {

  if (!dateValue) {

    return '';

  }


  const date =
    new Date(
      dateValue
    );


  if (
    isNaN(
      date.getTime()
    )
  ) {

    return '';

  }


  return date.toLocaleString(
    undefined,
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
  );

}

/* =========================================================
   BOARDING PASS STATUS
========================================================= */

function updateBoardingPassStatus(
  status
) {

  const currentStatus =
    status ||
    'Processing';


  boardingPassStatus.textContent =
    currentStatus;


  boardingPassStatus.className =
    'flight-status';


  if (
    currentStatus === 'Arrived' ||
    currentStatus === 'Completed'
  ) {

    boardingPassStatus.style.background =
      'rgba(39, 128, 94, 0.2)';

    boardingPassStatus.style.color =
      '#8ed4b3';

  }

  else if (
    currentStatus === 'Boarding' ||
    currentStatus === 'Departed' ||
    currentStatus === 'In Transit' ||
    currentStatus === 'Checked In'
  ) {

    boardingPassStatus.style.background =
      'rgba(23, 111, 120, 0.25)';

    boardingPassStatus.style.color =
      '#9bd6da';

  }

  else if (
    currentStatus === 'Delayed'
  ) {

    boardingPassStatus.style.background =
      'rgba(190, 137, 42, 0.2)';

    boardingPassStatus.style.color =
      '#f0c56b';

  }

  else if (
    currentStatus === 'Cancelled'
  ) {

    boardingPassStatus.style.background =
      'rgba(185, 77, 67, 0.25)';

    boardingPassStatus.style.color =
      '#ffaaa3';

  }

  else if (
    currentStatus === 'Refunded'
  ) {

    boardingPassStatus.style.background =
      'rgba(130, 91, 160, 0.25)';

    boardingPassStatus.style.color =
      '#d5b5ed';

  }

  else {

    boardingPassStatus.style.background =
      'rgba(255,255,255,0.1)';

    boardingPassStatus.style.color =
      '#c7dbde';

  }

}


/* =========================================================
   AUTO LOAD FROM URL
========================================================= */

function loadTrackingFromUrl() {

  const params =
    new URLSearchParams(
      window.location.search
    );


  const trackingNumber =
    params.get(
      'tracking'
    );


  if (
    trackingNumber
  ) {

    trackingNumberInput.value =
      trackingNumber
        .toUpperCase();


    trackingForm.requestSubmit();

  }

}


/* =========================================================
   START
========================================================= */

hideFlightResult();
hideBoardingPassResult();
loadTrackingFromUrl();