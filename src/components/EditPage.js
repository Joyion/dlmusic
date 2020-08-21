import React from 'react';
import { connect } from "react-redux"
import { startSetSong, startUpdateCue, startGetComposers } from "../actions/cues.action";
import genreObjArray from "./genreStyle";
import instrumentArray from "./instruments";
import descriptionArray from "./descriptions";
import pros from "./pros"
class CorrectEdit extends React.Component {

    constructor(props) {
        super(props);
        const publisherArray = [
            {
                publisherName: "Derek Luff Music, Inc.",
                publisherIpi: "337689810",
                publisherPro: "ASCAP",
            },
            {
                publisherName: "Dewmarc Music",
                publisherIpi: "355468339",
                publisherPro: "BMI",
            },
            {
                publisherName: "Ridek Music",
                publisherIpi: "568242236",
                publisherPro: "SESAC",
            }
        ]

        let sortGenres = genreObjArray.map((g) => { return g.genre });

        this.state = {
            proArray: pros,
            catalogName: "",
            songTitle: "",
            fName: "",
            mName: "",
            lName: "",
            suffix: "",
            cSplit: 0,
            cae: "",
            pro: "ASCAP",
            addComposer: -1,
            newSplit: 0,
            publisher: -1,
            publisherArray: publisherArray,
            publisherSplit: 0,
            genreArray: sortGenres,
            genre: -1,
            instrumentArray: instrumentArray,
            newInstrument: "",
            descriptionArray: descriptionArray,
            newDescription: "",
            tempo: "",
            rating: 0,
            band: "",
            film: "",
            status: "",
            mainVersion: "",
        }




        this.updateComposer = this.updateComposer.bind(this);
        this.removeComposer = this.removeComposer.bind(this);
        this.addComposer = this.addComposer.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.updatePublisher = this.updatePublisher.bind(this);
        this.removePublisher = this.removePublisher.bind(this);
        this.addPublisher = this.addComposer.bind(this);
        this.handleGenre = this.handleGenre.bind(this);
        this.handleInstrument = this.handleInstrument.bind(this);
        this.removeInstrument = this.removeInstrument.bind(this);
        this.handleDescription = this.handleDescription.bind(this);
        this.removeDescription = this.removeDescription.bind(this);
        this.handleNewDescription = this.handleNewDescription.bind(this);
        this.handleRating = this.handleRating.bind(this);
        this.handleTempo = this.handleTempo.bind(this);
        this.handleFilm = this.handleFilm.bind(this);
        this.handleBand = this.handleBand.bind(this);
        this.handleStatus = this.handleStatus.bind(this);
        this.handleVersion = this.handleVersion.bind(this);
        this.removeFilm = this.removeFilm.bind(this);
        this.removeBand = this.removeBand.bind(this);
        this.handleNewInstrument = this.handleNewInstrument.bind(this);

    }

    componentDidMount() {
        console.log("this is the param: " + this.props.match.params.id);
        let id = this.props.match.params.id;
        startSetSong(id, this.props.dispatch);
        startGetComposers(this.props.dispatch)

    }

    updatePublisher(e) {
        e.preventDefault();
        console.log(this.state.publisher);
        console.log(this.state.publisherSplit);
        const id = this.props.match.params.id;
        if (this.state.publisher != -1) {
            const p = this.state.publisherArray[this.state.publisher];
            if (this.state.publisherSplit == 0) {
                console.log("No split");
            } else {
                console.log(p.publisherName);

                let publisherArray = this.props.cue.publishers.map((p) => { return p });
                publisherArray.push({ ...p, publisherSplit: this.state.publisherSplit });
                startUpdateCue(id, "publishers", publisherArray, false, null, this.props.dispatch);
            }
        }
        else {
            console.log("No Publisher");
        }
    }

    removePublisher(e) {
        const id = this.props.match.params.id;
        const publisherId = e.target.name;
        let publisherArray = this.props.cue.publishers.filter((p) => { return p._id != publisherId });
        startUpdateCue(id, "publishers", publisherArray, false, null, this.props.dispatch);
    }

    updateComposer(e) {
        e.preventDefault();
        if (this.state.fName.trim() && this.state.cSplit > 0) {
            // console.log(this.state);

            let isthisNew = true;
            const id = this.props.match.params.id;
            const fullName = `${this.state.fName.trim()} ${this.state.mName.trim()} ${this.state.lName.trim()} ${this.state.suffix.trim()}`;
            const newComposer = {
                fullName: fullName,
                fName: this.state.fName.trim(),
                mName: this.state.mName.trim(),
                lName: this.state.lName.trim(),
                suffix: this.state.suffix.trim(),
                split: this.state.cSplit,
                cae: this.state.cae.trim(),
                pro: this.state.pro
            }

            if (this.props.composers.length > 0) {
                console.log("in composer lenght");
                let composerBank = [];
                composerBank = this.props.composers.filter((c) => {
                    return c.fullName.toUpperCase() == newComposer.fullName.toUpperCase()
                        && c.cae.toUpperCase() == newComposer.cae.toUpperCase() &&
                        c.pro.toUpperCase() == newComposer.pro.toUpperCase()
                })
                if (composerBank.length > 0) {
                    isthisNew = false;
                }
            }

            console.log(isthisNew);

            //    console.log(newComposer);

            let composers = this.props.cue.composers.map((e) => { return e });
            composers.push(newComposer);
            startUpdateCue(id, "composers", composers, isthisNew, newComposer, this.props.dispatch);
            this.setState({
                fName: "",
                mName: "",
                lName: "",
                suffix: "",
                cSplit: 0,
                cae: "",
                pro: "ASCAP",
            })
        }
        console.log("Everything is empty");

    }

    removeComposer(e) {
        e.preventDefault();
        const id = this.props.match.params.id;
        // console.log(e.target.name);
        const composerId = e.target.name;
        let composers = this.props.cue.composers.filter((e) => { return e._id != composerId });
        startUpdateCue(id, "composers", composers, null, null, this.props.dispatch);
    }

    addComposer(e) {

        e.preventDefault();

        if (this.state.addComposer != -1 && this.state.newSplit > 0) {
            let c = this.props.composers[this.state.addComposer];
            const id = this.props.match.params.id;
            const newComposer = {
                fullName: c.fullName,
                fName: c.fName,
                mName: c.mName,
                lName: c.lName,
                suffix: c.suffix,
                split: this.state.newSplit,
                cae: c.cae,
                pro: c.pro,
            }
            let composers = this.props.cue.composers.map((e) => { return e });
            composers.push(newComposer);
            startUpdateCue(id, "composers", composers, false, null, this.props.dispatch);
            this.setState({
                addComposer: -1,
                newSplit: 0
            })
        }
        console.log("Nothing to Add")

    }

    handleGenre(e) {
        e.preventDefault();
        const id = this.props.match.params.id;
        if (this.state.genre > -1) {
            let gs = this.state.genreArray[this.state.genre];
            //  console.log(gs);
            //   console.log(genreObjArray)
            let value = genreObjArray.filter((v) => { return gs == v.genre })
            //   console.log("This is the genre " + value[0].genre);
            startUpdateCue(id, "genreStyle", value[0], false, null, this.props.dispatch);
        }
        else {
            console.log("Choose a genre");
        }

    }

    handleInstrument(e) {
        //console.log(e.target.name);
        const id = this.props.match.params.id;
        const i = e.target.name;
        let newInstruments = this.props.cue.instruments.map((i) => { return i });
        if (newInstruments.includes(i)) {
            console.log("Instrument already added");
        }
        else {
            newInstruments.push(i);
            startUpdateCue(id, "instruments", newInstruments, false, null, this.props.dispatch);
        }

    }

    removeInstrument(e) {
        //
        const id = this.props.match.params.id;
        const newInst = e.target.name;
        const newInstruments = this.props.cue.instruments.filter((i) => { return i != newInst });
        startUpdateCue(id, "instruments", newInstruments, false, null, this.props.dispatch);
    }

    handleNewInstrument(e) {
        e.preventDefault();
        if (this.state.newInstrument.trim()) {
            const id = this.props.match.params.id;
            const i = this.state.newInstrument.trim();
            const newInstruments = this.props.cue.instruments.map((newIn) => { return newIn })
            if (newInstruments.includes(i)) {
                console.log("Instrument already added");
            }
            else {
                newInstruments.push(i);
                startUpdateCue(id, "instruments", newInstruments, false, null, this.props.dispatch);
                this.setState({
                    newInstrument: ""
                })
            }

        }
        else {
            console.log("no instrument to enter");
        }

    }


    handleDescription(e) {

        const id = this.props.match.params.id;
        const d = e.target.name;
        console.log(d);
        let newDescription = this.props.cue.descriptions.map((de) => { return de });
        if (newDescription.includes(d)) {
            console.log("Already Entered");
        }
        else {
            newDescription.push(d);
            startUpdateCue(id, "descriptions", newDescription, false, null, this.props.dispatch);
        }

    }

    handleNewDescription(e) {
        e.preventDefault();
        const id = this.props.match.params.id;
        const d = this.state.newDescription.trim();
        if (d) {
            console.log(d);
            let newDescription = this.props.cue.descriptions.map((de) => { return de });
            if (newDescription.includes(d)) {
                console.log("Already Entered");
                this.setState({
                    newDescription: ""
                })
            }
            else {
                newDescription.push(d.trim());
                startUpdateCue(id, "descriptions", newDescription, false, null, this.props.dispatch);
                this.setState({
                    newDescription: ""
                })
            }
        }
        else {
            console.log("No description entered");
        }

    }

    removeDescription(e) {
        const id = this.props.match.params.id;
        const d = e.target.name;
        const newDescription = this.props.cue.descriptions.filter((de) => { return de != d });
        startUpdateCue(id, "descriptions", newDescription, false, null, this.props.dispatch);

    }

    handleRating(e) {
        e.preventDefault();
        const id = this.props.match.params.id;
        const r = this.state.rating;
        if (r >= 0) {
            console.log(r);
            startUpdateCue(id, "rating", r, false, null, this.props.dispatch);
            this.setState({
                rating: 0
            })
        }
    }

    handleStatus(e) {
        e.preventDefault();
        const id = this.props.match.params.id;
        const s = this.state.status;
        if (s != "status") {
            console.log(s);
            startUpdateCue(id, "status", s, false, null, this.props.dispatch);
            this.setState({
                status: "Status"
            })
        }
    }

    handleTempo(e) {
        e.preventDefault();
        const id = this.props.match.params.id;
        const t = this.state.tempo;
        if (t != "tempo") {
            console.log(t);
            startUpdateCue(id, "tempo", t, false, null, this.props.dispatch);
            this.setState({
                tempo: ""
            })
        }
    }

    handleFilm(e) {
        e.preventDefault();
        const id = this.props.match.params.id;
        if (this.state.film.trim()) {
            const f = this.state.film.trim();
            console.log(f);
            let newFilms = this.props.cue.films.map((f) => { return f })
            if (newFilms.includes(f)) {
                console.log("film already entered");
                this.setState({
                    film: ""
                })

            }
            else {
                newFilms.push(f);
                startUpdateCue(id, "films", newFilms, false, null, this.props.dispatch);
                this.setState({
                    film: ""
                })
            }

        }
        else {
            console.log("No Film entered");
        }
    }

    removeFilm(e) {
        const id = this.props.match.params.id;
        const film = e.target.name;
        const newFilms = this.props.cue.films.filter((f) => { return f != film });
        startUpdateCue(id, "films", newFilms, false, null, this.props.dispatch);
    }

    handleBand(e) {
        e.preventDefault();
        const id = this.props.match.params.id;
        if (this.state.band.trim()) {
            const b = this.state.band.trim();
            let newBands = this.props.cue.bands.map((b) => { return b })
            if (newBands.includes(b)) {
                console.log("band already entered")
                this.setState({
                    band: ""
                })
            }
            else {
                newBands.push(b);
                startUpdateCue(id, "bands", newBands, false, null, this.props.dispatch);
                console.log(b);
                this.setState({
                    band: ""
                })
            }

        }
        else {
            console.log("NO BAND ENTERED");
        }
    }

    removeBand(e) {
        const id = this.props.match.params.id;
        const band = e.target.name;
        const newBands = this.props.cue.bands.filter((b) => { return b != band });
        startUpdateCue(id, "bands", newBands, false, null, this.props.dispatch);

    }

    handleVersion(e) {
        e.preventDefault();
        const id = this.props.match.params.id;
        if (this.state.mainVersion.trim()) {
            const v = this.state.mainVersion.trim();
            console.log(v)
            startUpdateCue(id, 'mainVersion', v, false, null, this.props.dispatch);
            this.setState({
                mainVersion: ""
            })
        }
        else {
            console.log("No Version Entered");
        }

    }


    handleInput(e) {
        const name = e.target.name;
        const value = e.target.value;
        //  console.log(name + " " + value);
        this.setState({
            [name]: value
        })

    }




    render() {
        return (
            <div>
                <div>
                    <div className="edit__title">
                        <h1>Song Title:</h1>
                        <p>{this.props.cue && this.props.cue.songTitle}</p>
                        <h1>Catalog:</h1>
                        <p>{this.props.cue && this.props.cue.catalogName}</p>
                    </div>


                    {this.props.cue ?
                        <div className="edit__title">
                            <audio controls src={"/wav/" + this.props.cue.release + "/" + this.props.cue.fileName} type="audio/wav" >
                            </audio>

                        </div> : <p>Unable to play media</p>}
                </div>




                <div class="edit__container">
                    <div>
                        <h2>Composer Metadata</h2>
                        <p>{this.props.cue && this.props.cue.metadataComposer}</p>


                        <h2>Composers</h2>

                        {/* this shows all the current composers on the cue's record */}
                        {this.props.cue && this.props.cue.composers ? this.props.cue.composers.length > 0 ?
                            this.props.cue.composers.map((c, i) => {
                                return <button onClick={this.removeComposer} name={c._id} key={i}>  {`${c.fullName} (${c.pro}) ${c.split}%`}</button>
                            })
                            : <p>No Composer data found. Please enter all Composer info</p>
                            : <p>No Composer data found. Please enter all Composer info</p>
                        }
                    </div>

                    <div>
                        <h3>Add Composer</h3>
                        <form className="edit__basic-form" onSubmit={this.addComposer}>
                            <div>
                            <label>
                                <select name="addComposer" onChange={this.handleInput} value={this.state.addComposer}>
                                    <option value={-1}>Composers</option>
                                    {this.props.composers && this.props.composers.map((c, i) => {
                                        const info = {
                                            fullName: c.fullName,
                                            fName: c.fName,
                                            mName: c.mName,
                                            lName: c.lName,
                                            suffix: c.suffix,
                                            cae: c.cae,
                                            pro: c.pro,
                                        }

                                        return <option key={i} value={i}>{`${c.fullName} (${c.pro}) CAE: ${c.cae}`}</option>
                                    })}
                                </select>
                            </label>
                            </div>
                           <div>
                                <label>
                                Split:
                 <input onChange={this.handleInput} name="newSplit" type="number" value={this.state.newSplit} />
                            </label>
                           </div>
                            <br />
                            <input type="submit" value="Add Composer" />
                        </form>

                        <h3>New Composer</h3>
                        <form  className="edit__composer-form" onSubmit={this.updateComposer}>


                            <label>
                                <p>First Name:</p>
                                <input name="fName" value={this.state.fName} type="text" onChange={this.handleInput} />
                            </label>
                            <label>
                                <p>Middle Name:</p>
                                <input name="mName" value={this.state.mName} type="text" onChange={this.handleInput} />
                            </label>
                            <label>
                                <p>Last Name:</p>
                                <input name="lName" value={this.state.lName} type="text" onChange={this.handleInput} />
                            </label>
                            <label>
                                <p>Suffix:</p>
                                <input name="suffix" value={this.state.suffix} type="text" onChange={this.handleInput} />
                            </label>
                            <label>
                                <p>Split:</p>
                                <input name="cSplit" value={this.state.cSplit} type="number" onChange={this.handleInput} />
                            </label>
                            <label>
                                <p>CAE</p>
                                <input name="cae" value={this.state.cae} type="text" onChange={this.handleInput} />
                            </label>
                            <label>
                                <p>Pro</p>
                                <select name="pro" value={this.state.pro} onChange={this.handleInput}>
                                    {this.state.proArray.map((p, i) => {
                                        return <option key={i} value={p}>{p}</option>
                                    })}
                                </select>
                            </label>
                            <input type="submit" value="Add New Composer" />
                        </form>

                    </div>
                </div>

                <div class="edit__container">
                    <div>
                        <h2>Publisher Metadata</h2>
                        <p>{this.props.cue && this.props.cue.metadataPublisher}</p>
                        <h2>Publishers</h2>

                        {this.props.cue && this.props.cue.publishers ? this.props.cue.publishers.length > 0 ? this.props.cue.publishers.map((p, i) => {
                            return <button onClick={this.removePublisher} name={p._id} key={i}>{`${p.publisherName} (${p.publisherPro}) ${p.publisherSplit}%`}</button>
                        }) : <p>No Publisher Data</p>
                            : <p>No Publisher Data</p>}
                    </div>

                    <div>
                        <h3>Add Publisher</h3>
                        {/* Add Publishing information */}
                        <form class="edit__small-form" onSubmit={this.updatePublisher}>
                            <label>
                        <select name="publisher" value={this.state.publisher} onChange={this.handleInput}>

                                    <option value={-1}>Publishers</option>

                                    {this.state.publisherArray && this.state.publisherArray.map((p, i) => {

                                        return <option key={i} value={i}>{`${p.publisherName} (${p.publisherPro}) IPI: ${p.publisherIpi}`}</option>
                                    })}

                                </select>
                            </label>
                            <label>
                                Split:
                            <input type="number" value={this.state.publisherSplit} name="publisherSplit" onChange={this.handleInput} />
                                
                            </label>
                            <input type="submit" value="Add Publisher" />
                        </form>

                    </div>
                </div>

                <div class="edit__container">
                    <div>
                        <h2>Genre</h2>
                        <p>{this.props.cue && this.props.cue.genreStyle ? this.props.cue.genreStyle : "N/A"}</p>
                    </div>

                    <div>
                        <h3>New Genre</h3>
                        <form name="genre" onSubmit={this.handleGenre}>
                            <select name="genre" value={this.state.genre} onChange={this.handleInput}>
                                <option value={-1}>Genre</option>
                                {this.state.genreArray && this.state.genreArray.map((g, i) => {
                                    return <option key={i} value={i}>{g}</option>
                                })}
                            </select>
                            <input type="submit" value="Update Genre" />
                        </form>
                    </div>
                </div>


                <div class="edit__container">
                    <div>
                        <h2>Instruments</h2>
                        {this.props.cue && this.props.cue.instruments ? this.props.cue.instruments.length > 0 ? this.props.cue.instruments.map((i, index) => {
                            return <button name={i} onClick={this.removeInstrument} key={index}>{i}</button>

                        }) : <p>No Instruments Added</p> : <p>No Instruments Added</p>}
                    </div>

                    <div>
                        <h3>Add Instruments</h3>
                        <div>
                            {this.state.instrumentArray && this.state.instrumentArray.map((i, index) => {
                                return <button onClick={this.handleInstrument} name={i} key={index}>{i}</button>
                            })}
                        </div>
                        <h3>Add New Instrument</h3>
                        <form onSubmit={this.handleNewInstrument}>
                            <label>
                                <input type="text" onChange={this.handleInput} value={this.state.newInstrument} name="newInstrument" />
                                <input type="submit" value="Add New Instrument" />
                            </label>
                        </form>
                    </div>
                </div>


                <div class="edit__container">
                    <div>
                        <h2>Descriptions</h2>
                        <div>
                            {this.props.cue && this.props.cue.descriptions ? this.props.cue.descriptions.length > 0 ? this.props.cue.descriptions.map((d, index) => {
                                return <button name={d} onClick={this.removeDescription} key={index}>{d}</button>

                            }) : <p>No Description Added</p> : <p>No Description Added</p>}
                        </div>
                    </div>

                    <div>
                        <h3>Add Description</h3>
                        <div>
                            {this.state.descriptionArray && this.state.descriptionArray.map((d, index) => {
                                return <button onClick={this.handleDescription} name={d} key={index}>{d}</button>
                            })}
                        </div>
                        <h3>Add New Description</h3>
                        <form onSubmit={this.handleNewDescription}>
                            <label>
                                <input value={this.state.newDescription}
                                    onChange={this.handleInput}
                                    name="newDescription"
                                    type="text" />
                                <input type="submit" value="Add Description" />
                            </label>
                        </form>
                    </div>
                </div>


                <div class="edit__container">
                    <div>
                        <h2>Rating</h2>
                        <p>{this.props.cue && this.props.cue.rating}</p>
                    </div>

                    <div>
                        <form onSubmit={this.handleRating}>
                            <label>
                                New Rating:
                    <input value={this.state.rating} name="rating" type="number" onChange={this.handleInput} />
                                <input type="submit" value="Update Rating" />
                            </label>
                        </form>
                    </div>
                </div>


                <div class="edit__container">
                    <div>
                        <h2>Sounds Like Films</h2>
                        <div>
                            {this.props.cue && this.props.cue.films ? this.props.cue.films.length > 0 ? this.props.cue.films.map((f, index) => {
                                return <button name={f} onClick={this.removeFilm} key={index}>{f}</button>

                            }) : <p>No Films Added</p> : <p>No Films Added</p>}
                        </div>
                    </div>

                    <div>
                        <form onSubmit={this.handleFilm}>
                            <label>
                                Film
                        <input value={this.state.film} name="film" type="text" onChange={this.handleInput} />
                                <input type="submit" value="Add film" />
                            </label>
                        </form>
                    </div>

                </div>


                <div class="edit__container">
                    <div>
                        <h2>Sounds Like Bands</h2>
                        <div>
                            {this.props.cue && this.props.cue.bands ? this.props.cue.bands.length > 0 ? this.props.cue.bands.map((b, index) => {
                                return <button name={b} onClick={this.removeBand} key={index}>{b}</button>

                            }) : <p>No Bands Added</p> : <p>No Bands Added</p>}
                        </div>
                    </div>

                    <div>
                        <form onSubmit={this.handleBand}>
                            <label>
                                Band:
                    <input value={this.state.band} name="band" type="text" onChange={this.handleInput} />
                                <input type="submit" value="Add band" />
                            </label>
                        </form>
                    </div>
                </div>


                <div class="edit__container">
                    <div>
                        <h2>Tempo</h2>
                        <p>{this.props.cue && this.props.cue.tempo}</p>
                    </div>

                    <div>
                        <form onSubmit={this.handleTempo}>
                            <label>
                                Change Tempo:
                        <select value={this.state.tempo} name="tempo" onChange={this.handleInput}>
                                    <option value="tempo">Tempo</option>
                                    <option value="Fast">Fast</option>
                                    <option value="Slow">Slow</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Changing Tempos">Changing Tempo</option>
                                    <option value="Non-Rhythmic"> Non-Rhythmic</option>
                                    <option value="N/A">N/A</option>
                                </select>
                                <input type="submit" value="Update Tempo" />
                            </label>
                        </form>
                    </div>
                </div>


                <div class="edit__container">
                    <div>
                        <h2>Main Version Filename</h2>
                        <p>{this.props.cue && this.props.cue.mainVersion}</p>
                    </div>
                    <div>
                        <form onSubmit={this.handleVersion}>
                            <input name="mainVersion" onChange={this.handleInput} type="text" value={this.mainVersion} />
                            <input type="submit" value="Update Main Version" />
                        </form>
                    </div>
                </div>


                <div class="edit__container">
                    <div>
                        <h2>Status</h2>
                        <p>{this.props.cue && this.props.cue.status}</p>
                    </div>

                    <div>
                        <form onSubmit={this.handleStatus}>
                            <label>
                                <select value={this.state.status} name="status" onChange={this.handleInput}>
                                    <option value="Status">Status</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Active">Active</option>
                                    <option value="Pulled">Pulled</option>
                                </select>
                                <input type="submit" value="Update Status" />
                            </label>
                        </form>
                    </div>
                </div>

























                {/* this is the last div */}
            </div>

        )
    }
}

const mapStateToProps = (state, props) => ({
    cue: state.cues.selectSong,
    composers: state.cues.composers
})

export default connect(mapStateToProps)(CorrectEdit);