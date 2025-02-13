package com.wubhotel.controller;

import com.wubhotel.model.Room;
import javafx.fxml.FXML;
import javafx.scene.control.*;
import javafx.stage.Stage;

public class RoomDialogController {
    @FXML private TextField roomNumberField;
    @FXML private ComboBox<Room.RoomType> roomTypeComboBox;
    @FXML private TextField priceField;
    @FXML private Button saveButton;
    @FXML private Button cancelButton;

    private Room room;
    private boolean okClicked = false;

    @FXML
    private void initialize() {
        roomTypeComboBox.getItems().setAll(Room.RoomType.values());
        
        // Add validation listeners
        roomNumberField.textProperty().addListener((observable, oldValue, newValue) -> {
            validateInput();
        });
        
        priceField.textProperty().addListener((observable, oldValue, newValue) -> {
            if (!newValue.matches("\\d*(\\.\\d*)?")) {
                priceField.setText(oldValue);
            }
            validateInput();
        });
    }

    private void validateInput() {
        boolean isValid = !roomNumberField.getText().trim().isEmpty()
                && roomTypeComboBox.getValue() != null
                && !priceField.getText().trim().isEmpty();
        saveButton.setDisable(!isValid);
    }

    @FXML
    private void handleSave() {
        if (isInputValid()) {
            room = new Room();
            room.setRoomNumber(roomNumberField.getText());
            room.setType(roomTypeComboBox.getValue());
            room.setPrice(Double.parseDouble(priceField.getText()));
            room.setStatus(Room.RoomStatus.AVAILABLE);
            
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

        if (roomNumberField.getText() == null || roomNumberField.getText().trim().isEmpty()) {
            errorMessage += "Invalid room number!\n";
        }
        if (roomTypeComboBox.getValue() == null) {
            errorMessage += "Please select a room type!\n";
        }
        if (priceField.getText() == null || priceField.getText().trim().isEmpty()) {
            errorMessage += "Invalid price!\n";
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

    public Room getRoom() {
        return room;
    }

    public boolean isOkClicked() {
        return okClicked;
    }
}
