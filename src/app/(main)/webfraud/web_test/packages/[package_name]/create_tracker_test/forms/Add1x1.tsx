import React, { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useParams } from "next/navigation";
import { Loader2, AlertCircle, CheckCircle2, Copy } from "lucide-react";
import { useGetPlatforms, useCreate1x1Tracker } from "../api";

interface Platform {
	value: string;
	label: string;
}

interface Tracker {
	tracker: string;
	placeholder: string;
	value: string;
}

interface TrackerLoadingState {
	firstQuartile: boolean;
	midPoint: boolean;
	thirdQuartile: boolean;
	complete: boolean;
	pause: boolean;
	mute: boolean;
	skip: boolean;
}

interface OneXOneTrackerPayload {
	platform_name: string;
	ro_number: string;
	campaign_name: string;
	tag_identifier: string;
	package_name: string;
	domain_name: string;
	trId: string;
	tracker_type: "video_1x1";
	email: string;
}

const Add1x1Tracker = () => {
	const { toast } = useToast();
	const ref = useRef(null);
	const params = useParams();
	const packageName = params.package_name as string;

	const { data: platformsData = [], isLoading: isLoadingPlatforms } = useGetPlatforms(packageName, "video_1x1");
	const create1x1Tracker = useCreate1x1Tracker();

	const platforms: Platform[] = platformsData.map((data: any) => ({
		value: data.platform_name,
		label: data.platform_name,
	}));

	const [trackerLoadingState, setTrackerLoadingState] = useState<TrackerLoadingState>({
		firstQuartile: false,
		midPoint: false,
		thirdQuartile: false,
		complete: false,
		pause: false,
		mute: false,
		skip: false,
	});

	const [trackers, setTrackers] = useState<Tracker[]>([
		{
			tracker: "firstQuartile",
			placeholder: "First Quartile Pixel here",
			value: "",
		},
		{
			tracker: "midPoint",
			placeholder: "Mid Point Pixel here",
			value: "",
		},
		{
			tracker: "thirdQuartile",
			placeholder: "Third Quartile Pixel here",
			value: "",
		},
		{
			tracker: "complete",
			placeholder: "Complete Pixel here",
			value: "",
		},
		{
			tracker: "pause",
			placeholder: "Pause Pixel here",
			value: "",
		},
		{
			tracker: "mute",
			placeholder: "Mute Pixel here",
			value: "",
		},
		{
			tracker: "skip",
			placeholder: "Skip Pixel here",
			value: "",
		}
	]);

	const [_1x1_imp_tracker, set_1x1_imp_tracker] = useState<string | null>(null);

	const initialFormValues = {
		platform_name: "",
		ro_number: "",
		campaign_name: "",
		tag_identifier: "",
		package_name: packageName,
	};

	const schema = Yup.object().shape({
		platform_name: Yup
			.string()
			.matches(/^[a-zA-Z0-9_-]+$/, "Invalid characters in the string")
			.required("Platform Name is required"),
		campaign_name: Yup
			.string()
			.matches(/^[a-zA-Z0-9_-]+$/, "Invalid characters in the string")
			.required("Campaign name is required"),
		tag_identifier: Yup
			.string()
			.matches(/^[a-zA-Z0-9_-]+$/, "Invalid characters in the string")
			.required("Tag Identifier is required"),
		ro_number: Yup
			.string()
			.matches(/^[a-zA-Z0-9_-]+$/, "Invalid characters in the string"),
	});

	const generate1x1Tracker = async (values: typeof initialFormValues) => {
		if (!(values.platform_name && values.tag_identifier && values.campaign_name)) {
			toast({
				title: "Error",
				description: "Required fields are missing!",
				variant: "destructive",
			});
			return;
		}

		try {
			const payload: OneXOneTrackerPayload = {
				...values,
				domain_name: window.location.hostname,
				trId: "imp_pixel",
				tracker_type: "video_1x1",
				email: localStorage.getItem("email") || "",
			};

			const response = await create1x1Tracker.mutateAsync(payload);
			set_1x1_imp_tracker(response.tracker_url);
		} catch (error) {
			console.error("Error creating tracker:", error);
		}
	};

	const generateTracker = async (values: typeof initialFormValues, tr_name: keyof TrackerLoadingState | "all") => {
		if (!(values.platform_name && values.tag_identifier && values.campaign_name)) {
			toast({
				title: "Error",
				description: "Required fields are missing!",
				variant: "destructive",
			});
			return;
		}

		try {
			const updatedTrackers = [...trackers];
			const temp_trackerLoadingState = { ...trackerLoadingState };

			if (tr_name === "all") {
				Object.keys(temp_trackerLoadingState).forEach((key) => {
					const typedKey = key as keyof TrackerLoadingState;
					temp_trackerLoadingState[typedKey] = true;
				});
			} else {
				temp_trackerLoadingState[tr_name] = true;
			}

			setTrackerLoadingState(temp_trackerLoadingState);

			for (const tracker of trackers) {
				if (tracker.tracker === tr_name || tr_name === "all") {
					const payload: OneXOneTrackerPayload = {
						...values,
						domain_name: window.location.hostname,
						trId: tracker.tracker,
						tracker_type: "video_1x1",
						email: localStorage.getItem("email") || "",
					};

					const response = await create1x1Tracker.mutateAsync(payload);
					const index = updatedTrackers.findIndex(t => t.tracker === tracker.tracker);
					if (index !== -1) {
						updatedTrackers[index].value = response.tracker_url;
					}
					temp_trackerLoadingState[tracker.tracker as keyof TrackerLoadingState] = false;
				}
			}

			setTrackerLoadingState(temp_trackerLoadingState);
			setTrackers(updatedTrackers);
		} catch (error) {
			console.error("Error creating tracker:", error);
		}
	};

	return (
		<Card className="p-6">
			<Formik
				innerRef={ref}
				enableReinitialize={true}
				validationSchema={schema}
				initialValues={initialFormValues}
				onSubmit={async (values) => {
					await generate1x1Tracker(values);
				}}
			>
				{({ values, handleChange, setFieldValue, handleBlur, touched, errors, isSubmitting }) => (
					<div>
						<Form className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-2">
									<label className="text-sm font-medium">Platform Name*</label>
									<Select
										onValueChange={(value) => setFieldValue("platform_name", value)}
										value={values.platform_name}
										disabled={isLoadingPlatforms}
									>
										<SelectTrigger className={`w-full ${errors.platform_name && touched.platform_name ? "border-red-500" : ""}`}>
											<SelectValue placeholder={isLoadingPlatforms ? "Loading platforms..." : "Select Platform"} />
											{isLoadingPlatforms && <Loader2 className="h-4 w-4 animate-spin" />}
										</SelectTrigger>
										<SelectContent position="popper">
											{platforms.map((platform) => (
												<SelectItem key={platform.value} value={platform.value}>
													{platform.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{errors.platform_name && touched.platform_name && (
										<div className="text-red-500 text-sm">{errors.platform_name}</div>
									)}
								</div>

								<div className="space-y-2">
									<label className="text-sm font-medium">Campaign Name*</label>
									<Field
										as={Input}
										name="campaign_name"
										placeholder="Enter Campaign Name"
										className={`w-full ${errors.campaign_name && touched.campaign_name ? "border-red-500" : ""}`}
									/>
									<ErrorMessage name="campaign_name" component="div" className="text-red-500 text-sm" />
								</div>

								<div className="space-y-2">
									<label className="text-sm font-medium">Tag Identifier*</label>
									<Field
										as={Input}
										name="tag_identifier"
										placeholder="Enter Tag Identifier"
										className={`w-full ${errors.tag_identifier && touched.tag_identifier ? "border-red-500" : ""}`}
									/>
									<ErrorMessage name="tag_identifier" component="div" className="text-red-500 text-sm" />
								</div>

								<div className="space-y-2">
									<label className="text-sm font-medium">RO Number</label>
									<Field
										as={Input}
										name="ro_number"
										placeholder="Enter RO Number"
										className={`w-full ${errors.ro_number && touched.ro_number ? "border-red-500" : ""}`}
									/>
									<ErrorMessage name="ro_number" component="div" className="text-red-500 text-sm" />
								</div>
							</div>

							<div className="space-y-4">
								<div className="flex items-center gap-4">
									<Input
										readOnly
										value={_1x1_imp_tracker || ""}
										placeholder="1x1 Impression Pixel"
										className="flex-1"
									/>
									<Button
										type="submit"
										disabled={isSubmitting}
										className="w-32"
									>
										{isSubmitting ? (
											<div className="flex items-center gap-2">
												<Loader2 className="h-4 w-4 animate-spin" />
												<span>Generating...</span>
											</div>
										) : (
											"Generate"
										)}
									</Button>
									{_1x1_imp_tracker && (
										<Button
											variant="outline"
											onClick={() => {
												navigator.clipboard.writeText(_1x1_imp_tracker);
												toast({
													title: "Copied",
													description: "1x1 Impression Pixel copied to clipboard",
												});
											}}
											className="w-32"
										>
											<Copy className="h-4 w-4 mr-2" />
											Copy
										</Button>
									)}
								</div>

								<div className="space-y-2">
									<h5 className="text-lg font-medium">Event Trackers (Optional)</h5>
									<div className="flex items-center gap-4">
										<Input
											readOnly
											placeholder="Generate All Trackers in one click"
											className="flex-1"
										/>
										<Button
											variant="outline"
											onClick={() => generateTracker(values, "all")}
											className="w-32"
										>
											Generate All
										</Button>
									</div>
								</div>

								{trackers.map((tr) => (
									<div key={tr.tracker} className="flex items-center gap-4">
										<Input
											readOnly
											value={tr.value}
											placeholder={tr.placeholder}
											className="flex-1"
										/>
										<Button
											variant="outline"
											onClick={() => generateTracker(values, tr.tracker as keyof TrackerLoadingState)}
											disabled={trackerLoadingState[tr.tracker as keyof TrackerLoadingState]}
											className="w-32"
										>
											{trackerLoadingState[tr.tracker as keyof TrackerLoadingState] ? (
												<div className="flex items-center gap-2">
													<Loader2 className="h-4 w-4 animate-spin" />
													<span>Generating...</span>
												</div>
											) : (
												"Generate"
											)}
										</Button>
										{tr.value && (
											<Button
												variant="outline"
												onClick={() => {
													navigator.clipboard.writeText(tr.value);
													toast({
														title: "Copied",
														description: `${tr.tracker} pixel copied to clipboard`,
													});
												}}
												className="w-32"
											>
												<Copy className="h-4 w-4 mr-2" />
												Copy
											</Button>
										)}
									</div>
								))}
							</div>
						</Form>
					</div>
				)}
			</Formik>
		</Card>
	);
};

export default Add1x1Tracker;