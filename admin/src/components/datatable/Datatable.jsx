import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Datatable = ({ columns }) => {
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const [list, setList] = useState([]);
  const { data, loading, error } = useFetch(`/${path}`);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);

  useEffect(() => {
    let isMounted = true;
    console.log("Fetched data:", data); // 🪵 Voir les données chargées

    if (path === "rooms") {
      const flattened = data?.flatMap((room) => {
        if (!room.roomNumbers) return [];
        return room.roomNumbers.map((roomNumber) => ({
          _id: `${room._id}-${roomNumber.number}`,
          title: room.title,
          desc: room.desc,
          price: room.price,
          maxPeople: room.maxPeople,
          roomNumber: roomNumber.number,
          unavailableDates: roomNumber.unavailableDates,
        }));
      });
      if (isMounted) setList(flattened);
    } else {
      if (isMounted && Array.isArray(data)) setList(data);
    }

    return () => {
      isMounted = false;
    };
  }, [data, path]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/${path}/${currentItemId}`);
      setList((prevList) => prevList.filter((item) => item._id !== currentItemId));
      setIsModalOpen(false);
      toast.success("Élément supprimé avec succès !");
    } catch (err) {
      console.error("Erreur lors de la suppression", err);
      toast.error("Erreur lors de la suppression de l'élément.");
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentItemId(null);
  };

  const handleModalOpen = (id) => {
    setCurrentItemId(id);
    setIsModalOpen(true);
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div className="cellAction">
          <Link to={`/${path}/${params.row._id}`} style={{ textDecoration: "none" }}>
            <div className="viewButton">View</div>
          </Link>
          <div className="deleteButton" onClick={() => handleModalOpen(params.row._id)}>
            Delete
          </div>
        </div>
      ),
    },
  ];

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      transform: "translate(-50%, -50%)",
      padding: "20px",
      width: "300px",
      textAlign: "center",
    },
  };

  Modal.setAppElement("#root");

  return (
    <div className="datatable">
      <div className="datatableTitle">
        {path}
        <Link to={`/${path}/new`} className="link">
          Add New
        </Link>
      </div>

      {loading ? (
        <div>Chargement...</div>
      ) : error ? (
        <div className="error">Une erreur est survenue</div>
      ) : (
        <DataGrid
          className="datagrid"
          rows={list || []}
          columns={columns.concat(actionColumn)}
          pageSize={9}
          rowsPerPageOptions={[9]}
          checkboxSelection
          getRowId={(row) => row._id || row.id} // Sécurisé pour les deux cas
        />
      )}

      {/* Modal de confirmation */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleModalClose}
        contentLabel="Confirmation Modal"
        style={customStyles}
      >
        <h2>Confirmer la suppression</h2>
        <p>Voulez-vous vraiment supprimer cet élément ?</p>
        <div>
          <button onClick={handleDelete}>Oui, supprimer</button>
          <button onClick={handleModalClose}>Annuler</button>
        </div>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default Datatable;
