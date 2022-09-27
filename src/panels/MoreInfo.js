import React from "react";
import adjacencyData from "../data/adjacencyData.json";
import tileData from "../data/tileData.json";
import boardData from "../data/boardData.json";

import influence from './icons/influence.png';
import planet from './icons/planet.png';
import resource from './icons/resource.png';
import specialtyBiotic from './icons/specialty-biotic.png';
import specialtyWarfare from './icons/specialty-warfare.png';
import specialtyPropulsion from './icons/specialty-propulsion.png';
import specialtyCybernetic from './icons/specialty-cybernetic.png';
import traitCultural from './icons/trait-cultural.png';
import traitHazardous from './icons/trait-hazardous.png';
import traitIndustrial from './icons/trait-industrial.png';

class MoreInfo extends React.Component {
    constructor(props) {
        super(props);

        this.getAdjacent = this.getAdjacent.bind(this);
    }

    getAdjacent(tileNumber) {
        // TODO rewrite this to calculate adjacencies, not reference them from a data file
        let originalAdjacencies = [...adjacencyData[tileNumber]];
        let adjacencies = [...adjacencyData[tileNumber]];
        // adjacencies.push(tileNumber);  // Add back in if we want to add the home system to these calcs

        let planets = 0;
        let resources = 0;
        let influence = 0;
        let specialties = {
            "biotic": 0,
            "warfare": 0,
            "propulsion": 0,
            "cybernetic": 0
        };
        let traits = {
            "cultural": 0,
            "industrial": 0,
            "hazardous": 0
        }

        while (adjacencies.length > 0) {
            let adjacentTileNumber = adjacencies.splice(0, 1)[0]
            let adjacentTile = this.props.tiles[adjacentTileNumber]
            if (tileData.hyperlanes.indexOf(this.props.getTileNumber(adjacentTile)) >= 0) {
                // This is a hyperlane, so add the tiles that are linked
                let hyperlaneAdjacencies = [...adjacencyData[adjacentTileNumber]];
                let tilePositionRelatedToHyperlane = hyperlaneAdjacencies.indexOf(Number(tileNumber)); // In the future this code can be adapted, with this tile number being the source tile
                let hyperlaneLinks = tileData.all[this.props.getTileNumber(adjacentTile)]["hyperlanes"];
                let currentRotation = Number(adjacentTile.split("-")[1])

                for (let hyperlane of hyperlaneLinks) {
                    let hyperlaneStart = (hyperlane[0] + currentRotation) % 6;
                    let hyperlaneEnd = (hyperlane[1] + currentRotation) % 6;
                    let hyperlaneStartTilenumber = hyperlaneAdjacencies[hyperlaneStart]
                    let hyperlaneEndTilenumber = hyperlaneAdjacencies[hyperlaneEnd]

                    if (hyperlaneStart === tilePositionRelatedToHyperlane && originalAdjacencies.indexOf(hyperlaneEndTilenumber) < 0) {
                        // Add the tile on the other end of this hyperlane to be added to the total
                        adjacencies.push(hyperlaneEndTilenumber)
                    } else if (hyperlaneEnd === tilePositionRelatedToHyperlane && originalAdjacencies.indexOf(hyperlaneStartTilenumber) < 0) {
                        // Add the tile on the other end of this hyperlane to be added to the total
                        adjacencies.push(hyperlaneStartTilenumber)
                    }
                }
            }
            if (adjacentTile > 0) {
                for (let planetIndex in tileData.all[adjacentTile]["planets"]) {
                    let planet = tileData.all[adjacentTile]["planets"][planetIndex];
                    planets += 1;
                    resources += planet["resources"];
                    influence += planet["influence"];
                    specialties[planet["specialty"]] += 1;
                    traits[planet["trait"]] += 1;
                }
            }
        }
        return {
            "planets": planets,
            "resources": resources,
            "influence": influence,
            "specialties": specialties,
            "traits": traits,
        }
    }

    render() {
        let moreInfoByPlayer = [];

        for (let tileNumber in this.props.tiles) {
            if ((this.props.tiles[tileNumber] >= 0 && this.props.tiles[tileNumber] < 18) ||
                (this.props.tiles[tileNumber] >= 51 && this.props.tiles[tileNumber] < 59)) {
                // This is a homeworld, so gather its info
                let adjacentInfo = this.getAdjacent(tileNumber);
                let playerName = this.props.currentPlayerNames[moreInfoByPlayer.length];
                if (playerName === "") {
                    playerName = "P" + (moreInfoByPlayer.length + 1);
                }
                moreInfoByPlayer.push(
                    <tr key={"more-info-" + playerName} >
                        <th scope="row">{playerName}</th>
                        <td>{adjacentInfo.resources}</td>
                        <td>{adjacentInfo.influence}</td>
                        <td>
                            <span className={"d-flex"}>
                                {[...Array(adjacentInfo.traits.cultural)].map((e, i) => <img key={playerName + "-cultural-" + i} className={"icon"} src={traitCultural} alt={"C"}/>)}
                                {[...Array(adjacentInfo.traits.hazardous)].map((e, i) => <img key={playerName + "-hazardous-" + i} className={"icon"} src={traitHazardous} alt={"H"}/>)}
                                {[...Array(adjacentInfo.traits.industrial)].map((e, i) => <img key={playerName + "-industrial-" + i} className={"icon"} src={traitIndustrial} alt={"I"}/>)}
                            </span>
                        </td>
                        <td>
                            <span className={"d-flex"}>
                                {[...Array(adjacentInfo.specialties.biotic)].map((e, i) => <img key={playerName + "-biotic-" + i} className={"icon"} src={specialtyBiotic} alt={"B"}/>)}
                                {[...Array(adjacentInfo.specialties.warfare)].map((e, i) => <img key={playerName + "-warfare-" + i} className={"icon"} src={specialtyWarfare} alt={"W"}/>)}
                                {[...Array(adjacentInfo.specialties.propulsion)].map((e, i) => <img key={playerName + "-propulsion-" + i} className={"icon"} src={specialtyPropulsion} alt={"P"}/>)}
                                {[...Array(adjacentInfo.specialties.cybernetic)].map((e, i) => <img key={playerName + "-cybernetic-" + i} className={"icon"} src={specialtyCybernetic} alt={"C"}/>)}
                            </span>
                        </td>
                    </tr>
                );
            }

        }
		
		//let fullSliceData = this.getSliceData();
		let fullSliceData = this.props.sliceData;
		let playerSliceDataString = [];
		
		if (fullSliceData != null && fullSliceData != undefined && fullSliceData.length > 0) {
			for (let j = 0; j < fullSliceData.length; j++){
				
				playerSliceDataString.push(
					<tr>
						<th scope="row">{fullSliceData[j].Player}</th>
						<td>{fullSliceData[j].SliceWeight}</td>
						<td>{fullSliceData[j].EQWeight}</td>
						<td>{fullSliceData[j].HSWeight}</td>
						<td>{fullSliceData[j].TotalWeight}</td>
						<td>{fullSliceData[j].PlayerWeight}</td>
						<td>{fullSliceData[j].HomeTile}</td>
						<td>{fullSliceData[j].Slice.toString()}</td>
						<td>{fullSliceData[j].Equidistant.toString()}</td>
						<td>{fullSliceData[j].SliceTiles.toString()}</td>
						<td>{fullSliceData[j].HomeResources}</td>
						<td>{fullSliceData[j].HomeInfluence}</td>
						<td>{fullSliceData[j].HomePlanets}</td>
						<td>{fullSliceData[j].HomeSpecialties}</td>
						<td>{fullSliceData[j].HomeWormholes}</td>
						<td>{fullSliceData[j].SliceResources}</td>
						<td>{fullSliceData[j].SliceInfluence}</td>
						<td>{fullSliceData[j].SlicePlanets}</td>
						<td>{fullSliceData[j].SliceSpecialties}</td>
						<td>{fullSliceData[j].SliceWormholes}</td>
						<td>{fullSliceData[j].SliceAnomalies}</td>
						<td>{fullSliceData[j].EQResources}</td>
						<td>{fullSliceData[j].EQInfluence}</td>
						<td>{fullSliceData[j].EQPlanets}</td>
						<td>{fullSliceData[j].EQSpecialties}</td>
						<td>{fullSliceData[j].EQWormholes}</td>
						<td>{fullSliceData[j].EQAnomalies}</td>
					</tr>

				);
			}
		}
		
        return (
            <div id="moreInfoContainer" className={this.props.visible ? "" : "d-none"}>
                <div className="title">
                    <h4 id="infoTitle" className="text-center">Assets Adjacent to Home System</h4>
                </div>
                <div id="moreInfo" className="">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col"></th>
                                <th scope="col"><img className={"icon"} src={resource} alt={"Res."}/></th>
                                <th scope="col"><img className={"icon"} src={influence} alt={"Inf."}/></th>
                                <th scope="col"><img className={"icon"} src={planet} alt={"Planets"}/></th>
                                <th scope="col"><img className={"icon"} src={specialtyWarfare} alt={"Tech"}/></th>
                            </tr>
                        </thead>
                        <tbody>
                            {moreInfoByPlayer}
                        </tbody>
                    </table>
					<table className="table">
                        <thead>
                            <tr>
                                <th scope="col"></th>
								<th scope="col">{"Slice Weight"}</th>
								<th scope="col">{"Equid Weight"}</th>
								<th scope="col">{"HS Weight"}</th>
								<th scope="col">{"Total Weight"}</th>
								<th scope="col">{"Player Weight"}</th>
								<th scope="col">{"HS Index"}</th>
                                <th scope="col">{"Slice Indexes"}</th>
                                <th scope="col">{"EquiDist Indexes"}</th>
								<th scope="col">{"Slice Tiles"}</th>
                                <th scope="col">{"HS RES"}</th>
								<th scope="col">{"HS INF"}</th>
								<th scope="col">{"HS Planets"}</th>
								<th scope="col">{"HS Specialties"}</th>
								<th scope="col">{"HS Wormholes"}</th>
								<th scope="col">{"Slice RES"}</th>
								<th scope="col">{"Slice INF"}</th>
								<th scope="col">{"Slice Planets"}</th>
								<th scope="col">{"Slice Specialties"}</th>
								<th scope="col">{"Slice Wormholes"}</th>
								<th scope="col">{"Slice Anomalies"}</th>
								<th scope="col">{"EquiDist RES"}</th>
								<th scope="col">{"EquiDist INF"}</th>
								<th scope="col">{"EquiDist Planets"}</th>
								<th scope="col">{"EquiDist Specialties"}</th>
								<th scope="col">{"EquiDist Wormholes"}</th>
								<th scope="col">{"EquiDist Anomalies"}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {playerSliceDataString}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}
export default MoreInfo;
