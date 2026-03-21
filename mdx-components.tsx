import { transformerColorizedBrackets } from "@shikijs/colorized-brackets";
import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import React, { ReactNode } from "react";
import { createHighlighter, Highlighter } from "shiki";
import theme from "./src/app/syntax-theme.json";
import { P5Sketch } from "./src/components/p5-sketch";
import { MarkdownTable } from "./src/components/MarkdownTable";
import {
  BouncingBall,
  FollowMouse,
  SineWave,
  CirclePattern,
  Particles,
  TrafficLight,
} from "./src/components/p5-examples";
import {
  ImperativeVsReactive,
  VirtualDomDiff,
  ProgressiveFramework,
} from "./src/components/vue-p5-examples";
import {
  FileChaosSim,
  GitTimeline,
  SnapshotVsDiff,
} from "./src/components/git-p5-examples";
import {
  SensorTypes,
  ActuatorTypes,
  ControlLoop,
  MEMSScale,
  SensorCharacteristics,
  SensorCategoryOverview,
  ActuatorCategoryOverview,
  PositionVelocitySensor,
  PresenceSensorDemo,
  PressureFlowDemo,
  BiosensorArchitecture,
  GlucoseBiosensor,
  BiosensorTransducers,
  GlucoseCalibrationCurve,
  HumanBodyOverview,
  BonePiezoelectric,
  MuscleActuator,
  HandSensors,
  FaceSenses,
  EyeAnatomy,
  ConeSpectralSensitivity,
  CCDSensorPipeline,
  EyeVsCamera,
  ConeColorMixing,
} from "./src/components/sensors-actuators-p5-examples";
import {
  PixelMatrixVisualization,
  GrayscaleLevels,
  RGBColorModel,
  RGBPixelGrid,
  BitDepthComparison,
  RGBColorSpace,
  AnalogToDigital,
  ImageResolutionDemo,
} from "./src/components/image-digitization-p5-examples";
import {
  UltrasoundImaging,
  ThermalCameraView,
  XRaySensorView,
  DepthSensorView,
  SensorSpectrumOverview,
  SensorApplicationsDashboard,
  SeismicSonarMapping,
} from "./src/components/image-sensors-p5-examples";
import {
  LogicalCommunication,
  HouseLetterAnalogy,
  TransportVsNetworkLayer,
  TCPvsUDP,
  MultiplexingDemux,
  SegmentEncapsulation,
} from "./src/components/transport-layer-p5-examples";
import { RoutingForwardingDataPlaneSimulator } from "./src/components/network-layer-p5-examples";
import {
  RouterArchitectureOverview,
  MemorySwitchingSimulator,
  BusSwitchingSimulator,
  CrossbarSwitchingSimulator,
} from "./src/components/router-architecture-p5-examples";
import {
  LongestPrefixMatchVisualizer,
  InputQueueContentionSimulator,
  OutputQueueBottleneckSimulator,
  DropTailVsRedComparator,
  SchedulingDisciplinesComparator,
  QueueCongestionTimelineSimulator,
} from "./src/components/router-decision-queueing-p5-examples";
import {
  IPv4HeaderDiagram,
  BitwiseAndMaskVisualizer,
  CIDRAggregationVisualizer,
  IPv4FragmentationSimulator,
  TTLHopsSimulator,
  CIDRLongestPrefixMatchVisualizer,
} from "./src/components/ipv4-cidr-p5-examples";
import {
  DhcpDoraSimulator,
  DhcpDoraTimelineVisualizer,
  AddressAllocationHierarchyVisualizer,
  DhcpPoolAllocatorSimulator,
  NatTranslationSimulator,
  DhcpToInternetFlowVisualizer,
} from "./src/components/dhcp-allocation-p5-examples";
import {
  NatPacketFlowVisualizer,
  NatTableDynamicSimulator,
  SLAACAutoConfigSimulator,
  DualStackTransitionSimulator,
} from "./src/components/nat-ipv6-p5-examples";
import {
  BestEffortVsQoSGuarantees,
  DatagramVsVirtualCircuitComparison,
  CongestionAndPacketDropSimulator,
  DijkstraStepByStep,
} from "./src/components/network-service-models-p5-examples";
import {
  RoutingTopologyR1R5Visualizer,
  DijkstraRoutingStepSimulator,
  DistanceVectorBellmanFordIterativeVisualizer,
  LinkStateVsDistanceVectorConvergenceComparator,
} from "./src/components/routing-fundamentals-p5-examples";
import {
  MultiplexingSender,
  DemultiplexingReceiver,
  UDPDemultiplexing,
  TCPDemultiplexing,
  UDPvsTCPDemuxComparison,
  SegmentHeaderPorts,
} from "./src/components/multiplexing-demux-p5-examples";
import {
  UDPBestEffort,
  UDPNoHandshake,
  UDPSegmentStructure,
  UDPChecksumDemo,
  UDPUseCases,
  UDPvsTPHeaderSize,
} from "./src/components/udp-protocol-p5-examples";
import {
  RDT10SimpleChannel,
  RDT20AckNak,
  RDT21SequenceNumbers,
  RDT22DuplicateAcks,
  RDT30TimerRetransmission,
  StopAndWaitUtilization,
  PipelineGBNvsSR,
} from "./src/components/reliable-data-transfer-p5-examples";
import {
  TCPPointToPoint,
  TCPSegmentStructure,
  TCPSequenceAckNumbers,
  TCPCumulativeAck,
  TCPRttEstimation,
  TCPTimeoutCalculation,
  TCPRetransmissionScenarios,
  TCPBuffersAndMSS,
} from "./src/components/tcp-fundamentals-p5-examples";
import {
  TCPFlowControlBuffer,
  TCPRwndZeroProblem,
  TCPThreeWayHandshake,
  TCPTwoWayHandshakeProblem,
  TCPConnectionTeardown,
  TCPResetFlag,
} from "./src/components/tcp-flow-connection-p5-examples";
import {
  CongestionCosts,
  CongestionScenarios,
  TCPAIMDSawtooth,
  TCPCongestionFSM,
  TCPCubicVsReno,
  TCPBBRvsLossBased,
  TCPSlowStartDetail,
} from "./src/components/congestion-control-p5-examples";
import {
  ECNSignaling,
  TCPFairnessConvergence,
  TCPFairnessLimits,
  QUICArchitecture,
  QUICHandshakeComparison,
  QUICHOLBlocking,
} from "./src/components/ecn-fairness-quic-p5-examples";
import {
  SignalDefinition,
  SignalExamples,
  SystemInputOutput,
  ContinuousVsDiscrete,
  SystemHardwareSoftware,
  SignalProcessingChain,
} from "./src/components/signals-systems-intro-p5-examples";
import {
  SignalEnergyArea,
  SignalPowerAverage,
  EnergyVsPowerSignals,
  RMSValueDemo,
  SinusoidalEnergyPower,
  SNRVisualization,
} from "./src/components/signal-energy-power-p5-examples";
import {
  TimeShiftDemo,
  TimeScalingDemo,
  TimeReversalDemo,
  ShiftThenScaleDemo,
  ScaleThenShiftDemo,
  CombinedOperationsSummary,
} from "./src/components/signal-operations-p5-examples"; // signal ops
import {
  ContinuousVsDiscreteTime,
  AnalogVsDigitalSignal,
  PeriodicVsAperiodic,
  EnergyVsPowerClassification,
  DeterministicVsRandom,
  SignalClassificationMap,
} from "./src/components/signal-classification-p5-examples";
import {
  UnitStepFunction,
  CausalSignalWithStep,
  UnitImpulseFunction,
  SamplingProperty,
  DelayedImpulseAndStep,
  ImpulseStepRelation,
} from "./src/components/signal-models-p5-examples";
import {
  SystemBlockDiagram,
  RCCircuitModel,
  RCCircuitResponse,
  InitialConditionsEffect,
  PhysicsToMathModel,
  NaturalVsForcedResponse,
} from "./src/components/systems-intro-p5-examples";
import {
  SuperpositionPrinciple,
  TimeInvarianceDemo,
  MemoryAndCausality,
  BIBOStabilityDemo,
  InvertibilityDemo,
  SystemClassificationSummary,
} from "./src/components/systems-classification-p5-examples";
import {
  TwoAnalysisMethods,
  ZeroInputZeroStateDecomp,
  CharacteristicModes,
  ConvolutionIntegral,
  LCITAnalysisWorkflow,
} from "./src/components/time-domain-analysis-p5-examples";
import {
  PolymericMatrixStructure,
  PropertiesComparison,
  ReinforcementTypes,
  MatrixComparison,
  SMCMolding,
  PultrusionProcess,
  LaminateComposites,
  SandwichPanel,
} from "./src/components/composite-matrix-polymer-p5-examples";

function getTextContent(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (!node) return "";

  if (Array.isArray(node)) {
    return node.map(getTextContent).join("");
  }

  if (typeof node === "object" && "props" in node) {
    return getTextContent(
      (node as { props: { children: ReactNode } }).props.children,
    );
  }

  return "";
}

function generateId(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

let highlighter: Highlighter | null = null;

async function getHighlighter() {
  if (!highlighter) {
    highlighter = await createHighlighter({
      langs: ["javascript", "css", "html", "typescript"],
      themes: [theme],
    });
  }
  return highlighter;
}

async function CodeBlock({ code, lang }: { code: string; lang: string }) {
  if (!code || typeof code !== 'string') {
    return <pre><code>{code}</code></pre>;
  }

  try {
    let out = (await getHighlighter()).codeToHtml(code, {
      lang: lang || 'text',
      theme: theme.name,
      transformers: [
        transformerColorizedBrackets({
          themes: {
            "Tailwind CSS": [
              "var(--color-purple-200)",
              "var(--color-cyan-300)",
              "var(--color-blue-300)",
              "var(--color-emerald-300)",
              "var(--color-pink-300)",
              "var(--color-amber-200)",
            ],
          },
        }),
      ],
    });

    return <div dangerouslySetInnerHTML={{ __html: out }} />;
  } catch (error) {
    // Fallback if syntax highlighting fails
    return <pre><code className={lang ? `language-${lang}` : ''}>{code}</code></pre>;
  }
}

const IMAGE_DIMENSION_REGEX = /^[^|]+\|\d+x\d+$/;

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => {
      let id = generateId(getTextContent(children));
      return <h1 id={id}>{children}</h1>;
    },
    h2: ({ children }) => {
      let id = generateId(getTextContent(children));
      return <h2 id={id}>{children}</h2>;
    },
    h3: ({ children }) => {
      let id = generateId(getTextContent(children));
      return <h3 id={id}>{children}</h3>;
    },
    h4: ({ children }) => {
      let id = generateId(getTextContent(children));
      return <h4 id={id}>{children}</h4>;
    },
    img: ({ alt, ...props }) => {
      let schemePlaceholder = encodeURIComponent("{scheme}");
      let width, height;
      if (IMAGE_DIMENSION_REGEX.test(alt)) {
        [width, height] = alt.split("|")[1].split("x").map(Number);
        alt = alt.split("|")[0];
      }
      if (props.src.includes(schemePlaceholder)) {
        return (
          <>
            <Image
              {...props}
              alt={alt}
              width={width}
              height={height}
              src={props.src.replace(schemePlaceholder, "light")}
              className="dark:hidden"
            />
            <Image
              {...props}
              alt={alt}
              width={width}
              height={height}
              src={props.src.replace(schemePlaceholder, "dark")}
              className="not-dark:hidden"
            />
          </>
        );
      } else {
        return <Image {...props} alt={alt} width={width} height={height} />;
      }
    },
    async pre(props) {
      let child = React.Children.only(props.children);
      if (!child) return null;
      let { children: code, className } = child.props;
      let lang = className ? className.replace("language-", "") : "";

      return <CodeBlock code={code} lang={lang} />;
    },
    P5Sketch,
    MarkdownTable,
    BouncingBall,
    FollowMouse,
    SineWave,
    CirclePattern,
    Particles,
    TrafficLight,
    ImperativeVsReactive,
    VirtualDomDiff,
    ProgressiveFramework,
    FileChaosSim,
    GitTimeline,
    SnapshotVsDiff,
    SensorTypes,
    ActuatorTypes,
    ControlLoop,
    MEMSScale,
    SensorCharacteristics,
    SensorCategoryOverview,
    ActuatorCategoryOverview,
    PositionVelocitySensor,
    PresenceSensorDemo,
    PressureFlowDemo,
    BiosensorArchitecture,
    GlucoseBiosensor,
    BiosensorTransducers,
    GlucoseCalibrationCurve,
    HumanBodyOverview,
    BonePiezoelectric,
    MuscleActuator,
    HandSensors,
    FaceSenses,
    EyeAnatomy,
    ConeSpectralSensitivity,
    CCDSensorPipeline,
    EyeVsCamera,
    ConeColorMixing,
    PixelMatrixVisualization,
    GrayscaleLevels,
    RGBColorModel,
    RGBPixelGrid,
    BitDepthComparison,
    RGBColorSpace,
    AnalogToDigital,
    ImageResolutionDemo,
    UltrasoundImaging,
    ThermalCameraView,
    XRaySensorView,
    DepthSensorView,
    SensorSpectrumOverview,
    SensorApplicationsDashboard,
    SeismicSonarMapping,
    LogicalCommunication,
    HouseLetterAnalogy,
    TransportVsNetworkLayer,
    TCPvsUDP,
    MultiplexingDemux,
    SegmentEncapsulation,
    RoutingForwardingDataPlaneSimulator,
    RouterArchitectureOverview,
    MemorySwitchingSimulator,
    BusSwitchingSimulator,
    CrossbarSwitchingSimulator,
    LongestPrefixMatchVisualizer,
    InputQueueContentionSimulator,
    OutputQueueBottleneckSimulator,
    DropTailVsRedComparator,
    SchedulingDisciplinesComparator,
    QueueCongestionTimelineSimulator,
    IPv4HeaderDiagram,
    BitwiseAndMaskVisualizer,
    CIDRAggregationVisualizer,
    IPv4FragmentationSimulator,
    TTLHopsSimulator,
    CIDRLongestPrefixMatchVisualizer,
    DhcpDoraSimulator,
    DhcpDoraTimelineVisualizer,
    AddressAllocationHierarchyVisualizer,
    DhcpPoolAllocatorSimulator,
    NatTranslationSimulator,
    DhcpToInternetFlowVisualizer,
    NatPacketFlowVisualizer,
    NatTableDynamicSimulator,
    SLAACAutoConfigSimulator,
    DualStackTransitionSimulator,
    BestEffortVsQoSGuarantees,
    DatagramVsVirtualCircuitComparison,
    CongestionAndPacketDropSimulator,
    DijkstraStepByStep,
    RoutingTopologyR1R5Visualizer,
    DijkstraRoutingStepSimulator,
    DistanceVectorBellmanFordIterativeVisualizer,
    LinkStateVsDistanceVectorConvergenceComparator,
    MultiplexingSender,
    DemultiplexingReceiver,
    UDPDemultiplexing,
    TCPDemultiplexing,
    UDPvsTCPDemuxComparison,
    SegmentHeaderPorts,
    UDPBestEffort,
    UDPNoHandshake,
    UDPSegmentStructure,
    UDPChecksumDemo,
    UDPUseCases,
    UDPvsTPHeaderSize,
    RDT10SimpleChannel,
    RDT20AckNak,
    RDT21SequenceNumbers,
    RDT22DuplicateAcks,
    RDT30TimerRetransmission,
    StopAndWaitUtilization,
    PipelineGBNvsSR,
    TCPPointToPoint,
    TCPSegmentStructure,
    TCPSequenceAckNumbers,
    TCPCumulativeAck,
    TCPRttEstimation,
    TCPTimeoutCalculation,
    TCPRetransmissionScenarios,
    TCPBuffersAndMSS,
    TCPFlowControlBuffer,
    TCPRwndZeroProblem,
    TCPThreeWayHandshake,
    TCPTwoWayHandshakeProblem,
    TCPConnectionTeardown,
    TCPResetFlag,
    CongestionCosts,
    CongestionScenarios,
    TCPAIMDSawtooth,
    TCPCongestionFSM,
    TCPCubicVsReno,
    TCPBBRvsLossBased,
    TCPSlowStartDetail,
    ECNSignaling,
    TCPFairnessConvergence,
    TCPFairnessLimits,
    QUICArchitecture,
    QUICHandshakeComparison,
    QUICHOLBlocking,
    SignalDefinition,
    SignalExamples,
    SystemInputOutput,
    ContinuousVsDiscrete,
    SystemHardwareSoftware,
    SignalProcessingChain,
    SignalEnergyArea,
    SignalPowerAverage,
    EnergyVsPowerSignals,
    RMSValueDemo,
    SinusoidalEnergyPower,
    SNRVisualization,
    TimeShiftDemo,
    TimeScalingDemo,
    TimeReversalDemo,
    ShiftThenScaleDemo,
    ScaleThenShiftDemo,
    CombinedOperationsSummary,
    ContinuousVsDiscreteTime,
    AnalogVsDigitalSignal,
    PeriodicVsAperiodic,
    EnergyVsPowerClassification,
    DeterministicVsRandom,
    SignalClassificationMap,
    UnitStepFunction,
    CausalSignalWithStep,
    UnitImpulseFunction,
    SamplingProperty,
    DelayedImpulseAndStep,
    ImpulseStepRelation,
    SystemBlockDiagram,
    RCCircuitModel,
    RCCircuitResponse,
    InitialConditionsEffect,
    PhysicsToMathModel,
    NaturalVsForcedResponse,
    SuperpositionPrinciple,
    TimeInvarianceDemo,
    MemoryAndCausality,
    BIBOStabilityDemo,
    InvertibilityDemo,
    SystemClassificationSummary,
    TwoAnalysisMethods,
    ZeroInputZeroStateDecomp,
    CharacteristicModes,
    ConvolutionIntegral,
    LCITAnalysisWorkflow,
    PolymericMatrixStructure,
    PropertiesComparison,
    ReinforcementTypes,
    MatrixComparison,
    SMCMolding,
    PultrusionProcess,
    LaminateComposites,
    SandwichPanel,
    ...components,
  };
}
