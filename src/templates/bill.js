import React from "react"
import {graphql} from 'gatsby'
import styles from "./bill.module.css"
import ProgressBadge from "../components/progress"
import {Container, FlexContainer} from "../components/container"
import LinkCard from "../components/linkCard"
import Layout from "../components/layout"
import SEO from "../components/seo"

export const formatDate = (date) => {
    if (date == null || date.year == null || date.month == null || date.day == null) {
        return '-'
    }
    return String(date.year) + "\n" + String(date.month).padStart(2, '0') + "/" + String(date.day).padStart(2, '0')
}

export default function Bill({data}) {
    const bill = data.politylink.allBills[0]
    const arrows = [
        {"title": "提出", "value": formatDate(bill.submittedDate), "color": 0},
        {"title": '衆議院\n委員会', "value": formatDate(bill.passedRepresentativesCommitteeDate), "color": 1},
        {"title": "衆議院\n本会議", "value": formatDate(bill.passedRepresentativesDate), "color": 2},
        {"title": "参議院\n委員会", "value": formatDate(bill.passedCouncilorsCommitteeDate), "color": 3},
        {"title": "参議院\n本会議", "value": formatDate(bill.passedCouncilorsDate), "color": 4},
        {"title": "交付", "value": formatDate(bill.proclaimedDate), "color": 5},
    ]
    const description = bill.name + "（" + bill.billNumber + "）に関する公式情報（議案本文、理由、概要、審議状況、国会会議録など）をまとめています。"
    return (
        <Layout>
            <SEO title={bill.name} description={description}/>
            <Container>
                <h2 className={styles.name}>{bill.name}</h2>
                <h3 className={styles.number}>{bill.billNumber}</h3>
                <p className={styles.reason}>{bill.reason}</p>
                <ProgressBadge arrows={arrows}/>
                <p className={styles.section}>公式リンク</p>
                <div className={styles.links}>
                    <FlexContainer>
                        {bill.urls.map((url) => {
                            return <LinkCard href={url.url} title={url.title} domain={url.domain}/>
                        })}
                    </FlexContainer>
                </div>
            </Container>
        </Layout>
    )
}

export const query = graphql`
    query($billId: ID!){
        politylink {
            allBills(filter:{id:$billId}){
                name
                billNumber
                reason
                urls {
                    url
                    title
                    domain
                }
                submittedDate{
                    year
                    month
                    day
                }
                passedRepresentativesCommitteeDate{
                    year
                    month
                    day
                }
                passedRepresentativesDate{
                    year
                    month
                    day
                }
                passedCouncilorsCommitteeDate{
                    year
                    month
                    day
                }
                passedCouncilorsDate{
                    year
                    month
                    day
                }
                proclaimedDate{
                    year
                    month
                    day
                }
            }
        }
    }
`