package com.wubhotel.controller;

import com.wubhotel.model.*;
import com.wubhotel.service.*;
import javafx.fxml.FXML;
import javafx.scene.control.*;
import javafx.stage.Stage;
import java.time.LocalDateTime;

public class QuickBookController {
    @FXML private TextField guestNameField;
    @FXML private TextField emailField;
    @FXML private TextField phoneField;
    @FXML private ComboBox<Room> roomComboBox;
    @FXML private DatePicker checkOutDatePicker;
    @FXML private Button bookButton;
    @FXML private Button cancelButton;

    private final RoomService roomService = new RoomService();
    private final GuestService guestService = new GuestService();
    private Reservation reservation;
    private boolean okClicked = false;

    @FXML
    private void initialize() {
        // Load available rooms
        roomComboBox.getItems().setAll(roomService.getAvailableRooms());
        
        // Set cell factory for room display
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
        
        // Add validation listeners
        guestNameField.textProperty().addListener((obs, oldVal, newVal) -> validateInput());
        emailField.textProperty().addListener((obs, oldVal, newVal) -> validateInput());
        phoneField.textProperty().addListener((obs, oldVal, newVal) -> validateInput());
        checkOutDatePicker.valueProperty().addListener((obs, oldVal, newVal) -> validateInput());
    }

    private void validateInput() {
        boolean isValid = !guestNameField.getText().trim().isEmpty()
                && !emailField.getText().trim().isEmpty()
                && !phoneField.getText().trim().isEmpty()
                && roomComboBox.getValue() != null
                && checkOutDatePicker.getValue() != null
                && checkOutDatePicker.getValue().isAfter(java.time.LocalDate.now());
        bookButton.setDisable(!isValid);
    }

    @FXML
    private void handleQuickBook() {
        if (isInputValid()) {
            // Create new guest
            Guest guest = new Guest();
            guest.setName(guestNameField.getText());
            guest.setEmail(emailField.getText());
            guest.setPhone(phoneField.getText());
            guest.setMembershipStatus(Guest.MembershipStatus.REGULAR);
            
            // Save guest
            guest = guestService.createGuest(guest);
            
            // Create reservation
            reservation = new Reservation();
            reservation.setGuest(guest);
            reservation.setRoom(roomComboBox.getValue());
            reservation.setCheckInDate(LocalDateTime.now());
            reservation.setCheckOutDate(LocalDateTime.of(checkOutDatePicker.getValue(), java.time.LocalTime.now()));
            
            // Calculate total amount
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

        if (guestNameField.getText().trim().isEmpty()) {
            errorMessage += "Please enter guest name!\n";
        }
        if (emailField.getText().trim().isEmpty()) {
            errorMessage += "Please enter email address!\n";
        } else if (!emailField.getText().matches("[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}")) {
            errorMessage += "Please enter a valid email address!\n";
        }
        if (phoneField.getText().trim().isEmpty()) {
            errorMessage += "Please enter phone number!\n";
        }
        if (roomComboBox.getValue() == null) {
            errorMessage += "Please select a room!\n";
        }
        if (checkOutDatePicker.getValue() == null) {
            errorMessage += "Please select check-out date!\n";
        } else if (!checkOutDatePicker.getValue().isAfter(java.time.LocalDate.now())) {
            errorMessage += "Check-out date must be after today!\n";
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
        return (Stage) bookButton.getScene().getWindow();
    }

    public Reservation getReservation() {
        return reservation;
    }

    public boolean isOkClicked() {
        return okClicked;
    }
}
