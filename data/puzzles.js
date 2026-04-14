const PUZZLES_DATA = {
    buildingOrder: ["crc", "ub", "tp", "tp2", "career"],
    buildings: {
        crc: {
            name: "CRC Building",
            emoji: "\u{1F3DB}\uFE0F",
            theme: "Agile Basics",
            puzzles: [
                {
                    id: 1,
                    title: "Agile Manifesto",
                    question: "Which is a core value of the Agile Manifesto?",
                    options: [
                        "Individuals and interactions over processes and tools",
                        "Comprehensive documentation over working software",
                        "Contract negotiation over customer collaboration",
                        "Following a plan over responding to change"
                    ],
                    correct: 0,
                    points: 100,
                    timeLimit: 60,
                    explanation: "The Agile Manifesto values individuals and interactions over processes and tools."
                },
                {
                    id: 2,
                    title: "Sprint Review",
                    question: "What is the primary goal of a Sprint Review?",
                    options: [
                        "Blame the team for missed deadlines",
                        "Demonstrate working software to stakeholders",
                        "Plan the next Sprint",
                        "Write documentation for completed features"
                    ],
                    correct: 1,
                    points: 100,
                    timeLimit: 60,
                    explanation: "The Sprint Review is about demonstrating working software to stakeholders and gathering feedback."
                },
                {
                    id: 3,
                    title: "Story Points",
                    question: "What do story points primarily measure?",
                    options: [
                        "Lines of code to be written",
                        "Hours of work required",
                        "Relative complexity and effort",
                        "Number of team meetings needed"
                    ],
                    correct: 2,
                    points: 100,
                    timeLimit: 60,
                    explanation: "Story points estimate the relative complexity and effort of a user story, not exact time."
                },
                {
                    id: 4,
                    title: "Product Owner",
                    question: "Who is responsible for prioritizing the Product Backlog?",
                    options: [
                        "Scrum Master",
                        "Development Team",
                        "Project Manager",
                        "Product Owner"
                    ],
                    correct: 3,
                    points: 100,
                    timeLimit: 60,
                    explanation: "The Product Owner is solely responsible for managing and prioritizing the Product Backlog."
                },
                {
                    id: 5,
                    title: "Delivery Frequency",
                    question: "According to Agile principles, how often should working software be delivered?",
                    options: [
                        "Once a year at the final release",
                        "Frequently, from a couple of weeks to a couple of months",
                        "Only when all features are 100% complete",
                        "Whenever the manager decides"
                    ],
                    correct: 1,
                    points: 100,
                    timeLimit: 60,
                    explanation: "Agile promotes delivering working software frequently, with a preference for shorter timescales."
                }
            ]
        },
        ub: {
            name: "UB Building",
            emoji: "\u{1F3E2}",
            theme: "Scrum & Sprints",
            puzzles: [
                {
                    id: 1,
                    title: "Daily Standup",
                    question: "What are the three key questions discussed in a Daily Standup?",
                    options: [
                        "What did I do? What will I do? Any blockers?",
                        "Who is late? Who is leaving? Who is new?",
                        "What went wrong? Whose fault? What's the fix?",
                        "How much budget? How many hours? How many bugs?"
                    ],
                    correct: 0,
                    points: 100,
                    timeLimit: 60,
                    explanation: "The Daily Standup covers what was done, what's planned, and any impediments."
                },
                {
                    id: 2,
                    title: "Sprint Length",
                    question: "What is the most common Sprint length in Scrum?",
                    options: [
                        "1 day",
                        "2 weeks",
                        "3 months",
                        "6 months"
                    ],
                    correct: 1,
                    points: 100,
                    timeLimit: 60,
                    explanation: "Two weeks is the most widely adopted Sprint length, balancing speed and planning."
                },
                {
                    id: 3,
                    title: "Scrum Master Role",
                    question: "What is the Scrum Master's primary responsibility?",
                    options: [
                        "Assigning tasks to developers",
                        "Writing code for the team",
                        "Removing impediments and facilitating the Scrum process",
                        "Approving or rejecting the final product"
                    ],
                    correct: 2,
                    points: 100,
                    timeLimit: 60,
                    explanation: "The Scrum Master serves the team by removing blockers and ensuring Scrum is followed correctly."
                },
                {
                    id: 4,
                    title: "Sprint Retrospective",
                    question: "When does the Sprint Retrospective take place?",
                    options: [
                        "Before Sprint Planning",
                        "During the Daily Standup",
                        "After the Sprint Review, before the next Sprint Planning",
                        "Only when something goes wrong"
                    ],
                    correct: 2,
                    points: 100,
                    timeLimit: 60,
                    explanation: "The Retrospective happens after the Sprint Review and before the next Sprint begins."
                },
                {
                    id: 5,
                    title: "Definition of Done",
                    question: "What is a 'Definition of Done' in Scrum?",
                    options: [
                        "A checklist the manager creates for each task",
                        "A shared team agreement on when a backlog item is truly complete",
                        "The date when the Sprint ends",
                        "A document listing all project bugs"
                    ],
                    correct: 1,
                    points: 100,
                    timeLimit: 60,
                    explanation: "The Definition of Done is a shared understanding of what 'complete' means for any work item."
                }
            ]
        },
        tp: {
            name: "TP Building",
            emoji: "\u{1F52C}",
            theme: "DevOps & CI/CD",
            puzzles: [
                {
                    id: 1,
                    title: "Continuous Integration",
                    question: "What does Continuous Integration (CI) mean?",
                    options: [
                        "Deploying code directly to production every hour",
                        "Merging code changes into a shared repository frequently with automated builds and tests",
                        "Writing all code in a single file to avoid merge conflicts",
                        "Having one developer integrate all the team's code manually"
                    ],
                    correct: 1,
                    points: 100,
                    timeLimit: 60,
                    explanation: "CI means frequently merging code into a shared repo and running automated builds/tests."
                },
                {
                    id: 2,
                    title: "CD vs CD",
                    question: "What is the difference between Continuous Delivery and Continuous Deployment?",
                    options: [
                        "They are exactly the same thing",
                        "Delivery is for frontend; Deployment is for backend",
                        "Delivery means code is ready to deploy manually; Deployment means it auto-deploys to production",
                        "Delivery is faster than Deployment"
                    ],
                    correct: 2,
                    points: 100,
                    timeLimit: 60,
                    explanation: "Continuous Delivery keeps code deployable at all times; Continuous Deployment automatically releases every change."
                },
                {
                    id: 3,
                    title: "DevOps Culture",
                    question: "What is a key principle of DevOps culture?",
                    options: [
                        "Developers and operations work in separate silos",
                        "Breaking down silos between Development and Operations teams",
                        "Only senior engineers handle deployments",
                        "Operations team writes all the code"
                    ],
                    correct: 1,
                    points: 100,
                    timeLimit: 60,
                    explanation: "DevOps breaks down silos so Dev and Ops teams collaborate throughout the software lifecycle."
                },
                {
                    id: 4,
                    title: "Version Control",
                    question: "Why is version control essential in a CI/CD pipeline?",
                    options: [
                        "It makes code look professional",
                        "It tracks changes, enables collaboration, and supports rollbacks",
                        "It replaces the need for testing",
                        "It is only needed for open-source projects"
                    ],
                    correct: 1,
                    points: 100,
                    timeLimit: 60,
                    explanation: "Version control is the foundation of CI/CD, enabling change tracking, collaboration, and safe rollbacks."
                },
                {
                    id: 5,
                    title: "Pipeline Stages",
                    question: "What is the correct order of a typical CI/CD pipeline?",
                    options: [
                        "Deploy \u2192 Test \u2192 Build",
                        "Test \u2192 Deploy \u2192 Build",
                        "Build \u2192 Test \u2192 Deploy",
                        "Build \u2192 Deploy \u2192 Test"
                    ],
                    correct: 2,
                    points: 100,
                    timeLimit: 60,
                    explanation: "The standard pipeline order is Build (compile), Test (verify), then Deploy (release)."
                }
            ]
        },
        tp2: {
            name: "TP2 Building",
            emoji: "\u{1F3D7}\uFE0F",
            theme: "Testing & QA",
            puzzles: [
                {
                    id: 1,
                    title: "Unit Testing",
                    question: "What does a unit test verify?",
                    options: [
                        "The entire application from end to end",
                        "Individual functions or methods in isolation",
                        "The user interface design",
                        "Network connectivity"
                    ],
                    correct: 1,
                    points: 100,
                    timeLimit: 60,
                    explanation: "Unit tests verify individual functions or methods in isolation, ensuring each piece works correctly."
                },
                {
                    id: 2,
                    title: "Test Pyramid",
                    question: "What type of test forms the base (largest layer) of the test pyramid?",
                    options: [
                        "End-to-end tests",
                        "Integration tests",
                        "Unit tests",
                        "Manual tests"
                    ],
                    correct: 2,
                    points: 100,
                    timeLimit: 60,
                    explanation: "Unit tests are the most numerous, fastest, and cheapest, forming the pyramid's base."
                },
                {
                    id: 3,
                    title: "Regression Testing",
                    question: "What is the purpose of regression testing?",
                    options: [
                        "Testing only new features",
                        "Ensuring new changes don't break existing functionality",
                        "Testing the application for the first time",
                        "Removing old test cases"
                    ],
                    correct: 1,
                    points: 100,
                    timeLimit: 60,
                    explanation: "Regression testing ensures that new code changes haven't broken previously working features."
                },
                {
                    id: 4,
                    title: "Test-Driven Development",
                    question: "In TDD (Test-Driven Development), what do you write first?",
                    options: [
                        "The production code",
                        "The documentation",
                        "A failing test",
                        "The deployment script"
                    ],
                    correct: 2,
                    points: 100,
                    timeLimit: 60,
                    explanation: "TDD follows Red-Green-Refactor: write a failing test first, then write code to make it pass."
                },
                {
                    id: 5,
                    title: "Acceptance Criteria",
                    question: "Who typically defines acceptance criteria for user stories?",
                    options: [
                        "The database administrator",
                        "The Product Owner with stakeholder input",
                        "The QA team alone",
                        "The Scrum Master"
                    ],
                    correct: 1,
                    points: 100,
                    timeLimit: 60,
                    explanation: "The Product Owner defines acceptance criteria based on stakeholder needs and business value."
                }
            ]
        },
        career: {
            name: "Career Centre",
            emoji: "\u{1F393}",
            theme: "Leadership & Soft Skills",
            puzzles: [
                {
                    id: 1,
                    title: "Servant Leadership",
                    question: "What is 'servant leadership' in an Agile context?",
                    options: [
                        "The leader makes all decisions for the team",
                        "Leading by serving the team and removing obstacles",
                        "Serving coffee during meetings",
                        "Being a servant to the client's every demand"
                    ],
                    correct: 1,
                    points: 100,
                    timeLimit: 60,
                    explanation: "Servant leaders empower teams by removing obstacles and enabling self-organization."
                },
                {
                    id: 2,
                    title: "Conflict Resolution",
                    question: "What is the best approach to handle team conflict in Agile?",
                    options: [
                        "Ignore it and hope it goes away",
                        "Escalate immediately to upper management",
                        "Address it openly in retrospectives and foster collaboration",
                        "Remove the team member causing conflict"
                    ],
                    correct: 2,
                    points: 100,
                    timeLimit: 60,
                    explanation: "Agile teams address conflict openly through retrospectives and collaborative problem-solving."
                },
                {
                    id: 3,
                    title: "Stakeholder Communication",
                    question: "How should progress be communicated to stakeholders in Agile?",
                    options: [
                        "Monthly written status reports only",
                        "Through regular demos of working software",
                        "Only when the entire project is finished",
                        "Via emails with Gantt charts"
                    ],
                    correct: 1,
                    points: 100,
                    timeLimit: 60,
                    explanation: "Working software demos are the Agile way to keep stakeholders informed and gather feedback."
                },
                {
                    id: 4,
                    title: "Cross-functional Teams",
                    question: "Why are cross-functional teams important in Agile?",
                    options: [
                        "They reduce the number of team members needed",
                        "They can deliver end-to-end without external dependencies",
                        "They eliminate the need for a Product Owner",
                        "They make documentation unnecessary"
                    ],
                    correct: 1,
                    points: 100,
                    timeLimit: 60,
                    explanation: "Cross-functional teams have all the skills needed to deliver work independently."
                },
                {
                    id: 5,
                    title: "Continuous Improvement",
                    question: "What practice best supports continuous improvement in Agile teams?",
                    options: [
                        "Annual performance reviews",
                        "Hiring new team members each Sprint",
                        "Regular retrospectives and feedback loops",
                        "Strict micromanagement"
                    ],
                    correct: 2,
                    points: 100,
                    timeLimit: 60,
                    explanation: "Retrospectives and feedback loops create a culture of continuous learning and improvement."
                }
            ]
        }
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = PUZZLES_DATA;
}
