package com.wubhotel.controller;

import com.wubhotel.model.*;
import com.wubhotel.service.*;
import javafx.fxml.FXML;
import javafx.scene.control.*;
import javafx.stage.Stage;
import java.time.LocalDateTime;

public class ReservationDialogController {
    @FXML private ComboBox<Guest> guestComboBox;
    @FXML private ComboBox<Room> roomComboBox;
    @FXML private DatePicker checkInDatePicker;
    @FXML private DatePicker checkOutDatePicker;
    @FXML private Button saveButton;
    @FXML private Button cancelButton;

    private final RoomService roomService = new RoomService();
    private final GuestService guestService = new GuestService();
    private Reservation reservation;
    private boolean okClicked = false;

    @FXML
    private void initialize() {
        // Load available rooms and guests
        roomComboBox.getItems().setAll(roomService.getAvailableRooms());
        guestComboBox.getItems().setAll(guestService.getAllGuests());
        
        // Set cell factories for nice display
        roomComboBox.setCellFactory(param -> new ListCell<Room>() {
            @Override
            protected void updateItem(Room room, boolean empty) {
                super.updateItem(room, empty);
                if (empty || room == null) {
                    setText(null);
                } else {
                    setText(String.format("%s - %s ($%.2f)", 
                        room.getRoomNumber(), room.getType(), room.getPrice()));
                }
            }
        });
        
        guestComboBox.setCellFactory(param -> new ListCell<Guest>() {
            @Override
            protected void updateItem(Guest guest, boolean empty) {
                super.updateItem(guest, empty);
                if (empty || guest == null) {
                    setText(null);
                } else {
                    setText(guest.getName() + " - " + guest.getEmail());
                }
            }
        });
        
        // Add validation listeners
        checkInDatePicker.valueProperty().addListener((obs, oldVal, newVal) -> {
            validateInput();
        });
        
        checkOutDatePicker.valueProperty().addListener((obs, oldVal, newVal) -> {
            validateInput();
        });
    }

    private void validateInput() {
        boolean isValid = guestComboBox.getValue() != null
                && roomComboBox.getValue() != null
                && checkInDatePicker.getValue() != null
                && checkOutDatePicker.getValue() != null
                && checkOutDatePicker.getValue().isAfter(checkInDatePicker.getValue());
        saveButton.setDisable(!isValid);
    }

    @FXML
    private void handleSave() {
        if (isInputValid()) {
            reservation = new Reservation();
            reservation.setGuest(guestComboBox.getValue());
            reservation.setRoom(roomComboBox.getValue());
            reservation.setCheckInDate(LocalDateTime.of(checkInDatePicker.getValue(), java.time.LocalTime.now()));
            reservation.setCheckOutDate(LocalDateTime.of(checkOutDatePicker.getValue(), java.time.LocalTime.now()));
            
            // Calculate total amount based on room price and duration
            double roomPrice = roomComboBox.getValue().getPrice();
            long days = java.time.Duration.between(
                reservation.getCheckInDate(),
                reservation.getCheckOutDate()
            ).toDays();
            reservation.setTotalAmount(roomPrice * days);
            
            okClicked = true;
            getStage().close();
        }
    }

    @FXML
    private void handleCancel() {
        getStage().close();
    }

    private boolean isInputValid() {
        String errorMessage = "";

        if (guestComboBox.getValue() == null) {
            errorMessage += "Please select a guest!\n";
        }
        if (roomComboBox.getValue() == null) {
            errorMessage += "Please select a room!\n";
        }
        if (checkInDatePicker.getValue() == null) {
            errorMessage += "Please select check-in date!\n";
        }
        if (checkOutDatePicker.getValue() == null) {
            errorMessage += "Please select check-out date!\n";
        } else if (checkOutDatePicker.getValue().isBefore(checkInDatePicker.getValue())) {
            errorMessage += "Check-out date must be after check-in date!\n";
        }

        if (errorMessage.isEmpty()) {
            return true;
        } else {
            Alert alert = new Alert(Alert.AlertType.ERROR);
            alert.setTitle("Invalid Fields");
            alert.setHeaderText("Please correct invalid fields");
            alert.setContentText(errorMessage);
            alert.showAndWait();
            return false;
        }
    }

    private Stage getStage() {
        return (Stage) saveButton.getScene().getWindow();
    }

    public Reservation getReservation() {
        return reservation;
    }

    public boolean isOkClicked() {
        return okClicked;
    }
}
