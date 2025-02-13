package com.wubhotel.controller;

import com.wubhotel.model.Guest;
import javafx.fxml.FXML;
import javafx.scene.control.*;
import javafx.stage.Stage;

public class GuestDialogController {
    @FXML private TextField nameField;
    @FXML private TextField emailField;
    @FXML private TextField phoneField;
    @FXML private ComboBox<Guest.MembershipStatus> membershipComboBox;
    @FXML private Button saveButton;
    @FXML private Button cancelButton;

    private Guest guest;
    private boolean okClicked = false;

    @FXML
    private void initialize() {
        membershipComboBox.getItems().setAll(Guest.MembershipStatus.values());
        membershipComboBox.setValue(Guest.MembershipStatus.REGULAR);
        
        // Add validation listeners
        nameField.textProperty().addListener((observable, oldValue, newValue) -> {
            validateInput();
        });
        
        emailField.textProperty().addListener((observable, oldValue, newValue) -> {
            validateInput();
        });
        
        phoneField.textProperty().addListener((observable, oldValue, newValue) -> {
            validateInput();
        });
    }

    private void validateInput() {
        boolean isValid = !nameField.getText().trim().isEmpty()
                && !emailField.getText().trim().isEmpty()
                && !phoneField.getText().trim().isEmpty()
                && membershipComboBox.getValue() != null;
        saveButton.setDisable(!isValid);
    }

    @FXML
    private void handleSave() {
        if (isInputValid()) {
            guest = new Guest();
            guest.setName(nameField.getText());
            guest.setEmail(emailField.getText());
            guest.setPhone(phoneField.getText());
            guest.setMembershipStatus(membershipComboBox.getValue());
            
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

        if (nameField.getText() == null || nameField.getText().trim().isEmpty()) {
            errorMessage += "Invalid name!\n";
        }
        if (emailField.getText() == null || emailField.getText().trim().isEmpty()) {
            errorMessage += "Invalid email!\n";
        } else if (!emailField.getText().matches("[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}")) {
            errorMessage += "Please enter a valid email address!\n";
        }
        if (phoneField.getText() == null || phoneField.getText().trim().isEmpty()) {
            errorMessage += "Invalid phone number!\n";
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

    public Guest getGuest() {
        return guest;
    }

    public boolean isOkClicked() {
        return okClicked;
    }
}
