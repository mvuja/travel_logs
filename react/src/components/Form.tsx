"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SmartDatetimeInput } from "@/components/ui/smart-datetime-input";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { useNavigate } from "react-router";

const formSchema = z.object({
    type: z.string(),
    departureDate: z.unknown(),
    arrivalDate: z.unknown(),
    departurePlace: z.string().min(1),
    arrivalPlace: z.string().min(1),
    accommodationPlace: z.string().min(1),
    comment: z.string(),
});

export default function MyForm() {
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            departureDate: new Date(),
            arrivalDate: new Date(),
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const url = "http://127.0.0.1:8000/api/travel-logs";
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values, null, 2),
            });
            if (!response.ok) {
                throw new Error("Failed to add travel log");
            }
            console.log(response.status);
            navigate("/");
        } catch (error) {
            console.error("Form submission error", error);
            toast.error("Failed to submit the form. Please try again.");
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 max-w-3xl mx-auto py-10"
            >
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Type of your travel</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl className="bg-drk-blue! w-full cursor-pointer">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a type of your travel" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="flight">
                                        Flight
                                    </SelectItem>
                                    <SelectItem value="rail">Rail</SelectItem>
                                    <SelectItem value="car">Car</SelectItem>
                                    <SelectItem value="hotel">Hotel</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="departureDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>When Is Your Departure Date?</FormLabel>
                            <FormControl>
                                <SmartDatetimeInput
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    placeholder="e.g. Tomorrow morning 9am"
                                />
                            </FormControl>
                            <FormDescription>
                                Please select the full time
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="arrivalDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>When Is Your Arrival Date?</FormLabel>
                            <FormControl>
                                <SmartDatetimeInput
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    placeholder="e.g. Tomorrow morning 9am"
                                />
                            </FormControl>
                            <FormDescription>
                                Please select the full time
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="departurePlace"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Departure Place</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Departure Place"
                                    type=""
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="arrivalPlace"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Arrival Place</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Arrival Place"
                                    type=""
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="accommodationPlace"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Accommodation Place</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Accommodation Place"
                                    type=""
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Comment</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Comment"
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button className="bg-yellow" type="submit">
                    Submit
                </Button>
            </form>
        </Form>
    );
}
