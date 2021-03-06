import React from "react"
import {graphql, navigate} from 'gatsby'
import SEO from "../components/seo"
import Layout from "../components/layout"
import {getTimelinesDescription, getTimelinesTitle} from "../utils/seoutils";
import {Container} from "../components/container";
import {buildPath} from "../utils/urlutils";
import {formatDate, formatJsDate} from "../utils/formatutils"
import {CALENDAR_TIMESTAMP_KEY} from "../utils/constants";
import Calendar from "react-calendar";
import "./calendar.css";


export const getDietDates = (timelines) => {
    return timelines
        .filter((timeline) => {
            return timeline.totalMinutes > 0
        })
        .map((timeline) => {
            return formatDate(timeline.date, "/")
        });
}

export const setDietDate = ({date, view}, dietDates) => {
    const fDate = formatJsDate(date, "/")
    return (view === "month" && dietDates.includes(fDate)) ? "react-calendar-diet-day"
        : (date.toDateString() === new Date().toDateString()) ? "react-calendar-today"
        : null;
}

export default class App extends React.Component {
    state = {
        date: (typeof window !== 'undefined' &&　sessionStorage.getItem(CALENDAR_TIMESTAMP_KEY) != null)
            ? new Date(Number(sessionStorage.getItem(CALENDAR_TIMESTAMP_KEY))) : new Date(),
    }

    onChange = value => {
        sessionStorage.setItem(CALENDAR_TIMESTAMP_KEY, String(Number(value)));
        this.setState({date: value});
    }

    dietDates = getDietDates(this.props.data.politylink.Timeline);

    render() {
        return (
            <Layout>
                <SEO title={getTimelinesTitle()} description={getTimelinesDescription()}/>
                <Container>
                    <p style={{textAlign: `center`, fontWeight: `bold`}}>国会タイムライン</p>
                    <div style={{textAlign: `right`, margin: `10px`}}>
                        <p style={{color: `#006edc`, paddingLeft: `15px`, fontSize: `0.8em`, display: `inline`}}>■ </p>
                        <p style={{fontSize: `0.8em`, display: `inline`}}>国会開催日</p>
                        <Calendar
                            locale={"ja-JP"}
                            calendarType={"US"}
                            onChange={this.onChange}
                            value={this.state.date}
                            view={"month"}
                            minDate={new Date(2020, 0, 1)}
                            maxDate={new Date()}
                            tileClassName={({date, view}) => setDietDate({date, view}, this.dietDates)}
                            onClickDay={(value) => navigate(buildPath(`Timeline:${formatJsDate(value, "")}`))}
                        />
                    </div>
                </Container>
            </Layout>
        )
    }
}

export const query = graphql`
    {
        politylink {
            Timeline (orderBy:id_desc) {
                id
                date { year, month, day }
                totalBills
                totalMinutes
                totalNews
            }
        }
    }
`
