package com.wubhotel.controller;

import com.wubhotel.model.*;
import com.wubhotel.service.*;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.stage.Modality;
import javafx.stage.Stage;
import java.io.IOException;
import java.net.URL;
import java.util.ResourceBundle;

public class MainController implements Initializable {
    @FXML private Label totalRoomsLabel;
    @FXML private Label availableRoomsLabel;
    @FXML private Label currentBookingsLabel;

    // Room Table
    @FXML private TableView<Room> roomsTable;
    @FXML private TableColumn<Room, String> roomNumberColumn;
    @FXML private TableColumn<Room, Room.RoomType> roomTypeColumn;
    @FXML private TableColumn<Room, Double> priceColumn;
    @FXML private TableColumn<Room, Room.RoomStatus> statusColumn;

    // Guest Table
    @FXML private TableView<Guest> guestsTable;
    @FXML private TableColumn<Guest, String> guestNameColumn;
    @FXML private TableColumn<Guest, String> emailColumn;
    @FXML private TableColumn<Guest, String> phoneColumn;
    @FXML private TableColumn<Guest, Guest.MembershipStatus> membershipColumn;

    // Reservation Table
    @FXML private TableView<Reservation> reservationsTable;
    @FXML private TableColumn<Reservation, Guest> reservationGuestColumn;
    @FXML private TableColumn<Reservation, Room> reservationRoomColumn;
    @FXML private TableColumn<Reservation, String> checkInColumn;
    @FXML private TableColumn<Reservation, String> checkOutColumn;
    @FXML private TableColumn<Reservation, Reservation.PaymentStatus> paymentStatusColumn;

    private final RoomService roomService = new RoomService();
    private final GuestService guestService = new GuestService();
    private final ReservationService reservationService = new ReservationService();

    @Override
    public void initialize(URL url, ResourceBundle rb) {
        setupTables();
        refreshData();
    }

    private void setupTables() {
        // Room Table
        roomNumberColumn.setCellValueFactory(new PropertyValueFactory<>("roomNumber"));
        roomTypeColumn.setCellValueFactory(new PropertyValueFactory<>("type"));
        priceColumn.setCellValueFactory(new PropertyValueFactory<>("price"));
        statusColumn.setCellValueFactory(new PropertyValueFactory<>("status"));

        // Guest Table
        guestNameColumn.setCellValueFactory(new PropertyValueFactory<>("name"));
        emailColumn.setCellValueFactory(new PropertyValueFactory<>("email"));
        phoneColumn.setCellValueFactory(new PropertyValueFactory<>("phone"));
        membershipColumn.setCellValueFactory(new PropertyValueFactory<>("membershipStatus"));

        // Reservation Table
        reservationGuestColumn.setCellValueFactory(new PropertyValueFactory<>("guest"));
        reservationRoomColumn.setCellValueFactory(new PropertyValueFactory<>("room"));
        checkInColumn.setCellValueFactory(new PropertyValueFactory<>("checkInDate"));
        checkOutColumn.setCellValueFactory(new PropertyValueFactory<>("checkOutDate"));
        paymentStatusColumn.setCellValueFactory(new PropertyValueFactory<>("paymentStatus"));

        // Set cell factories for better display
        reservationGuestColumn.setCellFactory(column -> new TableCell<Reservation, Guest>() {
            @Override
            protected void updateItem(Guest guest, boolean empty) {
                super.updateItem(guest, empty);
                if (empty || guest == null) {
                    setText(null);
                } else {
                    setText(guest.getName());
                }
            }
        });

        reservationRoomColumn.setCellFactory(column -> new TableCell<Reservation, Room>() {
            @Override
            protected void updateItem(Room room, boolean empty) {
                super.updateItem(room, empty);
                if (empty || room == null) {
                    setText(null);
                } else {
                    setText(room.getRoomNumber());
                }
            }
        });
    }

    @FXML
    private void handleAddRoom() {
        try {
            FXMLLoader loader = new FXMLLoader(getClass().getResource("/fxml/room-dialog.fxml"));
            Parent root = loader.load();

            Stage dialogStage = new Stage();
            dialogStage.setTitle("Add New Room");
            dialogStage.initModality(Modality.WINDOW_MODAL);
            dialogStage.initOwner(roomsTable.getScene().getWindow());

            Scene scene = new Scene(root);
            dialogStage.setScene(scene);

            RoomDialogController controller = loader.getController();
            dialogStage.showAndWait();

            if (controller.isOkClicked()) {
                Room room = controller.getRoom();
                roomService.createRoom(room);
                handleRefreshRooms();
            }
        } catch (IOException e) {
            e.printStackTrace();
            showError("Error", "Could not load room dialog", e.getMessage());
        }
    }

    @FXML
    private void handleAddGuest() {
        try {
            FXMLLoader loader = new FXMLLoader(getClass().getResource("/fxml/guest-dialog.fxml"));
            Parent root = loader.load();

            Stage dialogStage = new Stage();
            dialogStage.setTitle("Add New Guest");
            dialogStage.initModality(Modality.WINDOW_MODAL);
            dialogStage.initOwner(guestsTable.getScene().getWindow());

            Scene scene = new Scene(root);
            dialogStage.setScene(scene);

            GuestDialogController controller = loader.getController();
            dialogStage.showAndWait();

            if (controller.isOkClicked()) {
                Guest guest = controller.getGuest();
                guestService.createGuest(guest);
                handleRefreshGuests();
            }
        } catch (IOException e) {
            e.printStackTrace();
            showError("Error", "Could not load guest dialog", e.getMessage());
        }
    }

    @FXML
    private void handleNewReservation() {
        try {
            FXMLLoader loader = new FXMLLoader(getClass().getResource("/fxml/reservation-dialog.fxml"));
            Parent root = loader.load();

            Stage dialogStage = new Stage();
            dialogStage.setTitle("New Reservation");
            dialogStage.initModality(Modality.WINDOW_MODAL);
            dialogStage.initOwner(reservationsTable.getScene().getWindow());

            Scene scene = new Scene(root);
            dialogStage.setScene(scene);

            ReservationDialogController controller = loader.getController();
            dialogStage.showAndWait();

            if (controller.isOkClicked()) {
                Reservation reservation = controller.getReservation();
                reservationService.createReservation(reservation);
                handleRefreshReservations();
            }
        } catch (IOException e) {
            e.printStackTrace();
            showError("Error", "Could not load reservation dialog", e.getMessage());
        }
    }

    @FXML
    private void handleQuickBook() {
        try {
            FXMLLoader loader = new FXMLLoader(getClass().getResource("/fxml/quick-book-dialog.fxml"));
            Parent root = loader.load();

            Stage dialogStage = new Stage();
            dialogStage.setTitle("Quick Book");
            dialogStage.initModality(Modality.WINDOW_MODAL);
            dialogStage.initOwner(reservationsTable.getScene().getWindow());

            Scene scene = new Scene(root);
            dialogStage.setScene(scene);

            QuickBookController controller = loader.getController();
            dialogStage.showAndWait();

            if (controller.isOkClicked()) {
                Reservation reservation = controller.getReservation();
                reservationService.createReservation(reservation);
                handleRefreshReservations();
            }
        } catch (IOException e) {
            e.printStackTrace();
            showError("Error", "Could not load quick book dialog", e.getMessage());
        }
    }

    @FXML
    private void handleRefreshRooms() {
        roomsTable.getItems().setAll(roomService.getAllRooms());
        updateDashboardStats();
    }

    @FXML
    private void handleRefreshGuests() {
        guestsTable.getItems().setAll(guestService.getAllGuests());
    }

    @FXML
    private void handleRefreshReservations() {
        reservationsTable.getItems().setAll(reservationService.getAllReservations());
        updateDashboardStats();
    }

    @FXML
    private void handleExit() {
        System.exit(0);
    }

    @FXML
    private void handleAbout() {
        Alert alert = new Alert(Alert.AlertType.INFORMATION);
        alert.setTitle("About WUB Hotel");
        alert.setHeaderText("WUB Hotel Reservation System");
        alert.setContentText("Version 1.0\nDeveloped by Kabbo");
        alert.showAndWait();
    }

    private void updateDashboardStats() {
        totalRoomsLabel.setText(String.valueOf(roomService.getTotalRooms()));
        availableRoomsLabel.setText(String.valueOf(roomService.getAvailableRooms()));
        currentBookingsLabel.setText(String.valueOf(reservationService.getCurrentBookings()));
    }

    private void refreshData() {
        handleRefreshRooms();
        handleRefreshGuests();
        handleRefreshReservations();
    }

    private void showError(String title, String header, String content) {
        Alert alert = new Alert(Alert.AlertType.ERROR);
        alert.setTitle(title);
        alert.setHeaderText(header);
        alert.setContentText(content);
        alert.showAndWait();
    }
}