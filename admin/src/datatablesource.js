export const userColumns = [
  { field: "_id", headerName: "ID", width: 70 },
  {
    field: "user",
    headerName: "User",
    width: 230,
    renderCell: (params) => {
      console.log("ROW:", params.row); // Pour déboguer si besoin

      const imgUrl = params.row.img.startsWith("http")
        ? params.row.img
        : `http://localhost:8800${params.row.img}`;

      return (
        <div className="cellWithImg">
          <img
            src={imgUrl}
            alt="avatar"
            className="cellImg"
            onError={(e) => {
              e.target.src = "/default-avatar.png"; // Une image par défaut si erreur
            }}
          />
          {params.row.username}
        </div>
      );
    },
  },
  { field: "email", headerName: "Email", width: 200 },
  { field: "country", headerName: "Pays", width: 100 },
  { field: "city", headerName: "Ville", width: 100 },
  { field: "phone", headerName: "Téléphone", width: 120 },
  {
    field: "isAdmin",
    headerName: "Admin",
    width: 100,
    renderCell: (params) => (
      <span style={{ color: params.row.isAdmin ? "green" : "red" }}>
        {params.row.isAdmin ? "Oui" : "Non"}
      </span>
    ),
  },
];

export const hotelColumns = [
  { field: "_id", headerName: "ID", width: 250 },
  {
    field: "name",
    headerName: "Name",
    width: 150,
  },
  {
    field: "type",
    headerName: "Type",
    width: 100,
  },
  {
    field: "title",
    headerName: "Title",
    width: 230,
  },
  {
    field: "city",
    headerName: "City",
    width: 100,
  },
];
export const roomColumns = [
  {
    field: "roomNumber",
    headerName: "Room Number",
    width: 150,
  },
  {
    field: "unavailableDates",
    headerName: "Unavailable Dates",
    width: 250,
    valueGetter: (params) => {
      const dates = params.row.unavailableDates;
      if (dates && dates.length > 0) {
        return dates
          .map((d) => {
            const date = new Date(d);
            return !isNaN(date) ? date.toLocaleDateString() : "Invalid Date";
          })
          .join(" - ");
      }
      return "N/A";
    },
  },
  {
    field: "title",
    headerName: "Title",
    width: 230,
  },
  {
    field: "desc",
    headerName: "Description",
    width: 200,
  },
  {
    field: "price",
    headerName: "Price",
    width: 100,
  },
  {
    field: "maxPeople",
    headerName: "Max People",
    width: 100,
  },
];
export const reservationColumns = [
  {
    field: "userId",
    headerName: "User",
    width: 200,
    valueGetter: (params) => params.row.userId?.username || "N/A",
  },
  {
    field: "roomNumbers",
    headerName: "Rooms",
    width: 200,
    valueGetter: (params) => Array.isArray(params.row.roomNumbers)
      ? params.row.roomNumbers.join(", ")
      : "N/A",
  },
  {
    field: "dates",
    headerName: "Dates",
    width: 250,
    valueGetter: (params) =>
      params.row.dates?.map((d) => new Date(d).toLocaleDateString()).join(" - ") || "N/A",
  },
  {
    field: "price",
    headerName: "Total Price",
    width: 150,
  },
];
