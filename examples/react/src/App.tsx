import { Tilt } from "@levita-js/react";
import "levita-js/style.css";

function App() {
	const cardStyle = {
		width: "300px",
		height: "400px",
		background: "linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%)",
		borderRadius: "20px",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		color: "white",
		fontSize: "2rem",
		fontWeight: "bold",
		boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
	};

	const containerStyle = {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		height: "100vh",
		fontFamily: "system-ui, sans-serif",
	};

	return (
		<div style={containerStyle}>
			<Tilt glare maxGlare={0.5} shadow>
				<div style={cardStyle}>React</div>
			</Tilt>
		</div>
	);
}

export default App;
