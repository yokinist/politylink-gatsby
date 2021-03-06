import React from "react"
import {graphql, Link} from "gatsby"
import styles from "./minutes.module.css"
import {Container, FlexContainer} from "../components/container"
import Layout from "../components/layout"
import SEO from "../components/seo"
import LinkCard from "../components/linkCard"
import BillCard from "../components/billCard"
import CommitteeCard from "../components/committeeCard";
import {formatDate, formatDateWithDay, formatTopicSentence, formatLongSentence} from "../utils/formatutils"
import {buildPath} from "../utils/urlutils";
import {getMinutesDescription} from "../utils/seoutils";
import NewsCard from "../components/newsCard";
import {sortNewsList} from "../utils/sortutils";
import {toJsDate, toTimelineId} from "../utils/dateutils";
import {faCalendarAlt} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


export default function Minutes({data}) {
    const minutes = data.politylink.Minutes[0]
    const newsList = sortNewsList(minutes.news)

    return (
        <Layout>
            <SEO title={minutes.name} description={getMinutesDescription(minutes)}/>
            <Container>
                <h2 className={styles.name}>{minutes.name}</h2>
                <Link className={styles.timeline} to={buildPath(toTimelineId(toJsDate(minutes.startDateTime)))}>
                    <p className={styles.date}>
                        <FontAwesomeIcon icon={faCalendarAlt}/> {formatDateWithDay(minutes.startDateTime)}
                    </p>
                </Link>
                <div className={styles.summary}>
                    {minutes.summary != null &&
                    <p>{formatLongSentence(minutes.summary, 150)}</p>
                    }
                    {minutes.topics != null &&
                    <Container>
                        {minutes.topics.map((topic) => {
                            return <p className={styles.topic}> {formatTopicSentence(topic)} </p>
                        })}
                    </Container>}
                </div>

                <p className={styles.section}>公式リンク</p>
                <div className={styles.links}>
                    <FlexContainer>
                        {minutes.urls.map((url) => {
                            return <LinkCard href={url.url} title={url.title} domain={url.domain}/>
                        })}
                    </FlexContainer>
                </div>

                {minutes.belongedToCommittee != null &&
                <div>
                    <p className={styles.section}>所属委員会</p>
                    <div className={styles.committee}>
                        <FlexContainer>
                            <CommitteeCard
                                title={minutes.belongedToCommittee.name}
                                to={buildPath(minutes.belongedToCommittee.id)}
                                left={true}
                            />
                        </FlexContainer>
                    </div>
                </div>
                }

                {minutes.discussedBills.length > 0 &&
                <p className={styles.section}>法律案</p>
                }
                <div className={styles.bills}>
                    <FlexContainer>
                        {minutes.discussedBills.map((bill) => {
                            return <BillCard
                                title={bill.billNumber}
                                description={bill.name}
                                aliases={bill.aliases}
                                to={buildPath(bill.id)}
                                isPassed={bill.isPassed}
                                left={true}
                            />
                        })}
                    </FlexContainer>
                </div>

                {newsList.length > 0 &&
                <p className={styles.section}>関連ニュース</p>
                }
                <div className={styles.news}>
                    <FlexContainer>
                        {newsList.map((news) => {
                            return <NewsCard
                                href={news.url}
                                thumbnail={news.thumbnail}
                                title={news.title}
                                publisher={news.publisher}
                                publishedAt={formatDate(news.publishedAt)}
                                isPaid={news.isPaid}
                            />
                        })}
                    </FlexContainer>
                </div>
            </Container>
        </Layout>
    )
}

export const query = graphql`
    query($minutesId: ID!){
        politylink {
            Minutes(filter:{id:$minutesId}){
                name
                summary
                topics
                urls{
                    url
                    title
                    domain
                }
                belongedToCommittee{
                    id
                    name
                }
                discussedBills{
                    id
                    name
                    billNumber
                    isPassed
                    aliases
                }
                news {
                    title
                    url
                    isPaid
                    publisher
                    thumbnail
                    publishedAt { year, month, day, formatted }
                }
                startDateTime { year, month, day }
            }
        }
    }
`